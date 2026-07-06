-- ====================================================================
-- SCRIPT DE MIGRATION POUR LA TABLE DES MESSAGES (BEVULTA)
-- ====================================================================

-- 1. Ajouter les colonnes manquantes pour le suivi et les réponses
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS reply_date TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS ticket_ref TEXT;

-- 2. Mettre à jour la contrainte de validation du statut
-- Supprime l'ancienne contrainte s'il y en a une (généralement nommée 'messages_status_check')
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_status_check;

-- Crée la nouvelle contrainte incluant tous les états possibles ('unread', 'read', 'in-progress', 'resolved', 'replied')
ALTER TABLE public.messages ADD CONSTRAINT messages_status_check 
CHECK (status IN ('unread', 'read', 'in-progress', 'resolved', 'replied'));

-- 3. Mettre à jour les messages existants si nécessaire
UPDATE public.messages SET status = 'unread' WHERE status NOT IN ('unread', 'read', 'in-progress', 'resolved', 'replied');
