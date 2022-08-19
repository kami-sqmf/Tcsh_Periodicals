interface Users {
    username: string;
    name: string;
    avatar: string;
    bio: string;
    type: "public" | "private";
    website: string;
    pronouns: string;
    linked: linkedProvider
}
interface linkedProvider extends GoogleProvider, FacebookProvider{}

interface GoogleProvider {
    "google"?: string,
}

interface FacebookProvider {
    "facebook"?: string,
}