import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Resend } from "resend";
import multer from "multer";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // PDF Watermarking API Route
  app.post("/api/watermark", upload.single("pdf"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nenhum ficheiro PDF enviado." });
      }

      const watermarkText = req.body.text || "Memoo Livros - Autêntico";
      const pdfBytes = req.file.buffer;

      // Load PDF
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        
        // Add watermark in the center, diagonal
        page.drawText(watermarkText, {
          x: width / 4,
          y: height / 2,
          size: 50,
          font: helveticaFont,
          color: rgb(0.8, 0.8, 0.8),
          opacity: 0.3,
          rotate: degrees(45),
        });

        // Add small footer watermark on every page for extra protection
        page.drawText(`Protegido por Memoo Livros - Autêntico para: ${watermarkText}`, {
          x: 50,
          y: 20,
          size: 8,
          font: helveticaFont,
          color: rgb(0.5, 0.5, 0.5),
          opacity: 0.5,
        });
      }

      const modifiedPdfBytes = await pdfDoc.save();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="watermarked_${req.file.originalname}"`);
      res.send(Buffer.from(modifiedPdfBytes));
    } catch (err: any) {
      console.error("Watermark error:", err);
      res.status(500).json({ message: "Erro ao processar o PDF." });
    }
  });

  // Newsletter API Route
  app.post("/api/send-newsletter", async (req, res) => {
    const { subject, content, subscribers, imageUrl, videoUrl } = req.body;

    if (!subject || !content || !subscribers || !Array.isArray(subscribers)) {
      return res.status(400).json({ message: "Dados inválidos para a campanha." });
    }

    if (subscribers.length === 0) {
      return res.status(400).json({ message: "Nenhum subscritor na lista." });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is missing");
      return res.status(500).json({ 
        message: "O serviço de e-mail não está configurado. Configura a RESEND_API_KEY no painel de definições." 
      });
    }

    const resend = new Resend(apiKey);

    try {
      // Create media blocks
      let mediaHtml = "";
      
      if (imageUrl) {
        mediaHtml += `
          <div style="margin: 20px 0; text-align: center;">
            <img src="${imageUrl}" alt="Campaign Image" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
          </div>
        `;
      }

      if (videoUrl) {
        mediaHtml += `
          <div style="margin: 20px 0; text-align: center;">
            <a href="${videoUrl}" target="_blank" style="display: block; position: relative;">
              <div style="background: #f3f4f6; border-radius: 8px; padding: 40px 20px; border: 2px dashed #d1d5db; color: #3b82f6; text-decoration: none; font-weight: bold;">
                <span style="font-size: 48px;">▶</span><br/>
                Ver Vídeo da Campanha
              </div>
            </a>
          </div>
        `;
      }

      const { data, error } = await resend.emails.send({
        from: "Memoo Livros <onboarding@resend.dev>", 
        to: subscribers,
        subject: subject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
               <h1 style="color: #3b82f6; margin: 0;">Memoo Livros</h1>
               <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Curadoria Digital</p>
            </div>
            
            <h2 style="color: #111827; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; display: inline-block;">${subject}</h2>
            
            <div style="color: #4b5563; line-height: 1.6; font-size: 16px; margin-top: 20px;">
              ${content.replace(/\n/g, '<br>')}
            </div>

            ${mediaHtml}

            <div style="margin-top: 30px; text-align: center;">
              <a href="https://memoolivros.com" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">Visitar Marketplace</a>
            </div>

            <hr style="margin: 40px 0 20px 0; border: none; border-top: 1px solid #eee;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Recebeste este e-mail porque estás subscrito na newsletter da Memoo Livros.<br/>
              © 2026 Memoo Livros. Todos os direitos reservados.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        return res.status(500).json({ message: `Erro no serviço de e-mail: ${error.message}` });
      }

      res.json({ success: true, data });
    } catch (err: any) {
      console.error("Server error:", err);
      res.status(500).json({ message: "Erro interno ao processar a campanha." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
