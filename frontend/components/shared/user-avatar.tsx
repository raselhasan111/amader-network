import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function UserAvatar({src, classNames, fallback}: { src: string | undefined, classNames?: string, fallback?: string }) {
    const fallbackChar = fallback && fallback.trim() ? fallback.trim()[0] : "U";
    return (
        <Avatar>
            <AvatarImage className={classNames} src={src} alt={fallbackChar} />
            <AvatarFallback className={classNames}>{fallbackChar}</AvatarFallback>
        </Avatar>
    );
}
