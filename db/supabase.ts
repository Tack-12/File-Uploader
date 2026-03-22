import { createClient } from '@supabase/supabase-js'
import "dotenv/config";

// Create a single supabase client for interacting with your database
const supabase = createClient(String(process.env.SUPABASE_URL), String(process.env.SUPABASE_SERVICE_ROLE_KEY), {
        auth: {
                persistSession: false,
        }
});

async function createBucket() {
        const { data, error } = await supabase.storage.createBucket('files', {
                public: false,
                fileSizeLimit: 10 * 1024 * 1024
        })
        if (error?.statusCode !== "409") {
                console.error("Bucket creation failed:", error)
        } else {
                console.log("Bucket created")
        }
}

createBucket();
export { supabase };

