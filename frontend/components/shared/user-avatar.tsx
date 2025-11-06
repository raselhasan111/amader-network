import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function UserAvatar({src, containerClassname, fallback}: { src: string | undefined, containerClassname?: string, fallback?: string }) {
    const fallbackChar = fallback && fallback.trim() ? fallback.trim()[0] : "U";
    return (
        <Avatar className={containerClassname}>
            <AvatarImage src={src} alt={fallbackChar} />
            <AvatarFallback>{fallbackChar}</AvatarFallback>
        </Avatar>
    );
}
