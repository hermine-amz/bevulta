import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "bevulta@gmail.com"; // Modifiez si vous utilisez un autre email admin

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gérer les requêtes OPTIONS (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY n'est pas configuré dans les secrets Supabase.");
    }

    const payload = await req.json();
    console.log("Webhook reçu:", JSON.stringify(payload, null, 2));

    const { type, table, record, old_record } = payload;

    if (table !== "messages") {
      return new Response(JSON.stringify({ message: "Table ignorée" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    let emailSent = false;
    let details = "";

    // Cas 1 : Nouveau message client inséré
    if (type === "INSERT") {
      console.log("Traitement d'une insertion (nouveau message)...");

      // 1. Notifier l'admin
      const adminMailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Bevulta Alert <onboarding@resend.dev>", // Utiliser le domaine de test gratuit Resend
          to: ADMIN_EMAIL,
          subject: `[Nouveau Message] ${record.subject} - de ${record.name}`,
          html: `
            <h3>Nouveau message de contact reçu sur Bevulta</h3>
            <p><strong>Nom :</strong> ${record.name}</p>
            <p><strong>Email :</strong> ${record.email || 'Non spécifié'}</p>
            <p><strong>Téléphone :</strong> ${record.phone}</p>
            <p><strong>Pays :</strong> ${record.country}</p>
            <p><strong>Sujet :</strong> ${record.subject}</p>
            <p><strong>Message :</strong></p>
            <blockquote style="background: #f3f4f6; padding: 15px; border-left: 4px solid #10b981; margin: 0;">
              ${record.message.replace(/\n/g, '<br/>')}
            </blockquote>
            <br/>
            <p><a href="https://bevulta.com/admin" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accéder au Dashboard Admin</a></p>
          `,
        }),
      });

      const adminMailData = await adminMailRes.json();
      console.log("Réponse Resend (Admin Email):", adminMailData);

      // 2. Accusé de réception automatique au client (si email fourni)
      if (record.email) {
        const clientMailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Bevulta <onboarding@resend.dev>",
            to: record.email,
            subject: `Accusé de réception - Référence ${record.ticketRef || 'MSG-' + record.id}`,
            html: `
              <h3>Bonjour ${record.name},</h3>
              <p>Nous avons bien reçu votre message concernant : <strong>"${record.subject}"</strong>.</p>
              <p>Notre équipe technique étudie votre demande et vous répondra dans les plus brefs délais.</p>
              <br/>
              <div style="background: #f9fafb; padding: 15px; border: 1px dashed #d1d5db; border-radius: 5px;">
                <strong>Référence de suivi :</strong> <code style="font-size: 1.1rem; color: #3b82f6;">${record.ticketRef || 'MSG-' + record.id}</code>
                <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #6b7280;">Vous pouvez suivre l'état de ce message directement sur votre espace client Bevulta.</p>
              </div>
              <br/>
              <p>Cordialement,<br/><strong>L'équipe Bevulta</strong></p>
            `,
          }),
        });

        const clientMailData = await clientMailRes.json();
        console.log("Réponse Resend (Client Email):", clientMailData);
      }

      emailSent = true;
      details = "Emails d'alerte admin et d'accusé de réception client envoyés";
    }

    // Cas 2 : Réponse de l'admin (mise à jour de la colonne admin_reply)
    else if (type === "UPDATE" && record.admin_reply && (!old_record || !old_record.admin_reply)) {
      console.log("Traitement d'une mise à jour (réponse admin)...");

      if (record.email) {
        const replyMailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Bevulta <onboarding@resend.dev>",
            to: record.email,
            subject: `Réponse à votre message - Réf ${record.ticketRef || 'MSG-' + record.id}`,
            html: `
              <h3>Bonjour ${record.name},</h3>
              <p>Notre équipe a répondu à votre message concernant : <strong>"${record.subject}"</strong>.</p>
              
              <div style="background: #eff6ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 0 5px 5px 0;">
                <strong style="color: #3b82f6;">Réponse de Bevulta :</strong>
                <p style="margin: 10px 0 0 0; line-height: 1.6; color: #1f2937;">${record.admin_reply.replace(/\n/g, '<br/>')}</p>
              </div>

              <p>Vous pouvez également consulter cette réponse et l'historique complet depuis votre dashboard client.</p>
              <br/>
              <p>Cordialement,<br/><strong>L'équipe Bevulta</strong></p>
            `,
          }),
        });

        const replyMailData = await replyMailRes.json();
        console.log("Réponse Resend (Réponse Admin Email):", replyMailData);
        emailSent = true;
        details = "Email de réponse envoyé au client";
      } else {
        details = "Mise à jour détectée mais le client n'a pas d'adresse e-mail renseignée";
      }
    }

    return new Response(JSON.stringify({ success: true, emailSent, details }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erreur critique dans la fonction:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
