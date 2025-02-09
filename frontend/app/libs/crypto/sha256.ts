export async function sha256Hash(message: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return hash;
}