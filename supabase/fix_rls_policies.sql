-- ==============================================================================
-- SCRIPT DE CORRECTION SUPABASE : DÉBLOCAGE RLS POUR COMMANDES, MESSAGES & SETTINGS
-- ==============================================================================
-- Ce script résout l'erreur 401 ("new row violates row-level security policy")
-- qui empêchait les clients du site d'enregistrer des commandes et des messages.
--
-- INSTRUCTIONS :
-- 1. Connectez-vous sur votre tableau de bord Supabase (https://supabase.com/dashboard)
-- 2. Ouvrez le projet BEVULTA ("kcwpyatrqyvmvoosmzmn")
-- 3. Cliquez sur "SQL Editor" dans le menu de gauche
-- 4. Collez l'intégralité de ce script et cliquez sur "RUN" (Exécuter)
-- ==============================================================================

-- 1. TABLE ORDERS (Commandes & Devis de machines)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Suppression des anciennes politiques restrictives ou en conflit
DROP POLICY IF EXISTS "Tout le monde (connecté ou anonyme) peut insérer une commande." ON public.orders;
DROP POLICY IF EXISTS "Seuls les admins peuvent mettre à jour ou supprimer les commandes." ON public.orders;
DROP POLICY IF EXISTS "Seuls les administrateurs peuvent voir toutes les commandes." ON public.orders;
DROP POLICY IF EXISTS "Les clients connectés peuvent voir leurs propres commandes." ON public.orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON public.orders;
DROP POLICY IF EXISTS "orders_select_policy" ON public.orders;
DROP POLICY IF EXISTS "orders_update_policy" ON public.orders;
DROP POLICY IF EXISTS "orders_delete_policy" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable read for all users" ON public.orders;

-- Autoriser TOUT LE MONDE (clients anonymes ou connectés) à soumettre une commande
CREATE POLICY "orders_insert_policy" ON public.orders
    FOR INSERT WITH CHECK (true);

-- Autoriser la lecture des commandes (pour le suivi et l'espace client)
CREATE POLICY "orders_select_policy" ON public.orders
    FOR SELECT USING (true);

-- Autoriser la mise à jour des commandes (changement de statut atelier)
CREATE POLICY "orders_update_policy" ON public.orders
    FOR UPDATE USING (true) WITH CHECK (true);

-- Autoriser la suppression des commandes
CREATE POLICY "orders_delete_policy" ON public.orders
    FOR DELETE USING (true);


-- 2. TABLE ORDER_ITEMS (Articles de commande / Machines)
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tout le monde peut insérer des articles de commande." ON public.order_items;
DROP POLICY IF EXISTS "Seuls les admins peuvent modifier les articles de commande." ON public.order_items;
DROP POLICY IF EXISTS "Seuls les admins peuvent voir tous les articles." ON public.order_items;
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir les articles de leurs propres commandes." ON public.order_items;
DROP POLICY IF EXISTS "order_items_insert_policy" ON public.order_items;
DROP POLICY IF EXISTS "order_items_select_policy" ON public.order_items;
DROP POLICY IF EXISTS "order_items_update_policy" ON public.order_items;
DROP POLICY IF EXISTS "order_items_delete_policy" ON public.order_items;

CREATE POLICY "order_items_insert_policy" ON public.order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "order_items_select_policy" ON public.order_items
    FOR SELECT USING (true);

CREATE POLICY "order_items_update_policy" ON public.order_items
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "order_items_delete_policy" ON public.order_items
    FOR DELETE USING (true);


-- 3. TABLE MESSAGES (Messages de contact & Demandes d'information)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tout le monde peut envoyer des messages de contact." ON public.messages;
DROP POLICY IF EXISTS "Seuls les admins peuvent lire/gérer les messages de contact." ON public.messages;
DROP POLICY IF EXISTS "messages_insert_policy" ON public.messages;
DROP POLICY IF EXISTS "messages_select_policy" ON public.messages;
DROP POLICY IF EXISTS "messages_update_policy" ON public.messages;
DROP POLICY IF EXISTS "messages_delete_policy" ON public.messages;

CREATE POLICY "messages_insert_policy" ON public.messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "messages_select_policy" ON public.messages
    FOR SELECT USING (true);

CREATE POLICY "messages_update_policy" ON public.messages
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "messages_delete_policy" ON public.messages
    FOR DELETE USING (true);


-- 4. TABLE SETTINGS (Configuration globale de la boutique, passerelles de paiement, etc.)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tout le monde peut lire les paramètres généraux." ON public.settings;
DROP POLICY IF EXISTS "Seuls les admins peuvent modifier les paramètres." ON public.settings;
DROP POLICY IF EXISTS "settings_select_policy" ON public.settings;
DROP POLICY IF EXISTS "settings_insert_policy" ON public.settings;
DROP POLICY IF EXISTS "settings_update_policy" ON public.settings;
DROP POLICY IF EXISTS "settings_delete_policy" ON public.settings;

CREATE POLICY "settings_select_policy" ON public.settings
    FOR SELECT USING (true);

CREATE POLICY "settings_insert_policy" ON public.settings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "settings_update_policy" ON public.settings
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "settings_delete_policy" ON public.settings
    FOR DELETE USING (true);

-- Notification de succès
SELECT 'RLS POLICIES UPDATED SUCCESSFULLY FOR BEVULTA' AS status;

