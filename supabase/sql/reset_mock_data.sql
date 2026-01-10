-- Reset all mock/seed data for fresh start
-- Keep settings table as it contains site configuration

-- Clear content tables
TRUNCATE TABLE blogs CASCADE;
TRUNCATE TABLE projects CASCADE;
TRUNCATE TABLE testimonials CASCADE;

-- Clear user interaction tables
TRUNCATE TABLE contact_messages CASCADE;
TRUNCATE TABLE newsletter_subscribers CASCADE;
TRUNCATE TABLE page_views CASCADE;

-- Clear email campaign tables
TRUNCATE TABLE email_sends CASCADE;
TRUNCATE TABLE email_campaigns CASCADE;

-- Clear backup and token tables
TRUNCATE TABLE data_backups CASCADE;
TRUNCATE TABLE unsubscribe_tokens CASCADE;
