'use server';

import { createServerClient } from '@/lib/supabase/server';
import { ApiResponse } from '@/lib/types';

export interface ContactInput {
    name: string;
    email: string;
    message: string;
}

export async function submitContactForm(input: ContactInput): Promise<ApiResponse> {
    try {
        const supabase = createServerClient();

        const { error } = await supabase
            .from('contacts')
            .insert({
                name: input.name,
                email: input.email,
                message: input.message,
            });

        if (error) {
            console.error('Error submitting contact form:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to submit contact form:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}
