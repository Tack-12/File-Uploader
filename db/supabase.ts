import { createClient } from '@supabase/supabase-js'
import "dotenv/config";

// Create a single supabase client for interacting with your database
const supabase = createClient(String(process.env.SUPABASE_URL), String(process.env.SUPABASE_KEY));

async function createBucket() {
        const { data, error } = await supabase.storage.createBucket('files', {
                public: false,
                fileSizeLimit: 1024
        })
        if (error) {
                console.error("Bucket creation failed:", error)
        } else {
                console.log("Bucket created:", data)
        }
}

createBucket();
export { supabase };

