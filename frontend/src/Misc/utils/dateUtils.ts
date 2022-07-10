export function now() :string {
    const now = new Date();
    return now.toLocaleDateString();
}
