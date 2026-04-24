import { z } from 'zod';

export const shortenUrlSchema = z.object({
    url: z.string().url('Invalid URL format'),
    expiry: z.string().datetime().optional(), // ISO 8601 string
});

export type ShortenUrlRequest = z.infer<typeof shortenUrlSchema>;
