import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('login_token', (table) => {
    // Security: Add index on expiresAt for better performance on WHERE expiresAt > NOW() queries
    // This prevents slow queries that could be exploited for DoS attacks
    table.index('expiresAt', 'idx_login_token_expires_at');

    // Security: Add composite index on (email, expiresAt) for faster lookups in getByEmail
    // This optimizes the most common query pattern
    table.index(['email', 'expiresAt'], 'idx_login_token_email_expires');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('login_token', (table) => {
    table.dropIndex('expiresAt', 'idx_login_token_expires_at');
    table.dropIndex(['email', 'expiresAt'], 'idx_login_token_email_expires');
  });
}
