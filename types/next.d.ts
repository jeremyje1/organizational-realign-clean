// Temporary type declarations to resolve Next.js import errors

declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
    keywords?: string[];
    author?: string;
    robots?: string;
    openGraph?: {
      title?: string;
      description?: string;
      images?: string[];
    };
  }
}

declare module 'next/image' {
  import { FC } from 'react';
  
  interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    quality?: number;
    fill?: boolean;
    sizes?: string;
    style?: React.CSSProperties;
    className?: string;
    onLoad?: () => void;
    onError?: () => void;
  }
  
  const Image: FC<ImageProps>;
  export default Image;
}

declare module 'next/headers' {
  export function cookies(): {
    get: (name: string) => { value: string } | undefined;
    set: (name: string, value: string, options?: any) => void;
    delete: (name: string) => void;
    has: (name: string) => boolean;
    getAll: () => Array<{ name: string; value: string }>;
  };
  
  export function headers(): Headers;
}

declare module 'next/navigation' {
  export function useSearchParams(): URLSearchParams;
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    prefetch: (url: string) => void;
  };
  export function usePathname(): string;
  export function useParams(): { [key: string]: string | string[] };
  export function redirect(url: string): never;
  export function notFound(): never;
}

// Custom type declarations for missing modules
declare module 'next/link' {
  import { ComponentType } from 'react';
  
  interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    legacyBehavior?: boolean;
    onMouseEnter?: (e: React.MouseEvent) => void;
    onTouchStart?: (e: React.TouchEvent) => void;
    onClick?: (e: React.MouseEvent) => void;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    target?: string;
    rel?: string;
  }
  
  const Link: ComponentType<LinkProps>;
  export default Link;
}

declare module '@heroicons/react/24/outline' {
  import { ComponentType, SVGProps } from 'react';
  
  interface HeroIconProps extends SVGProps<SVGSVGElement> {
    className?: string;
  }
  
  export const ArrowRightIcon: ComponentType<HeroIconProps>;
  export const ChevronRightIcon: ComponentType<HeroIconProps>;
  export const CheckIcon: ComponentType<HeroIconProps>;
  export const XMarkIcon: ComponentType<HeroIconProps>;
  export const Bars3Icon: ComponentType<HeroIconProps>;
  export const UserIcon: ComponentType<HeroIconProps>;
  export const EnvelopeIcon: ComponentType<HeroIconProps>;
  export const PhoneIcon: ComponentType<HeroIconProps>;
  export const MapPinIcon: ComponentType<HeroIconProps>;
  export const CalendarIcon: ComponentType<HeroIconProps>;
  export const ClockIcon: ComponentType<HeroIconProps>;
  export const StarIcon: ComponentType<HeroIconProps>;
  export const HeartIcon: ComponentType<HeroIconProps>;
  export const HandThumbUpIcon: ComponentType<HeroIconProps>;
  export const ShareIcon: ComponentType<HeroIconProps>;
  export const ArrowDownTrayIcon: ComponentType<HeroIconProps>;
  export const ArrowUpTrayIcon: ComponentType<HeroIconProps>;
  export const MagnifyingGlassIcon: ComponentType<HeroIconProps>;
  export const FunnelIcon: ComponentType<HeroIconProps>;
  export const Cog6ToothIcon: ComponentType<HeroIconProps>;
  export const HomeIcon: ComponentType<HeroIconProps>;
  export const InformationCircleIcon: ComponentType<HeroIconProps>;
  export const ExclamationTriangleIcon: ComponentType<HeroIconProps>;
  export const CheckCircleIcon: ComponentType<HeroIconProps>;
  export const XCircleIcon: ComponentType<HeroIconProps>;
  export const PlusIcon: ComponentType<HeroIconProps>;
  export const MinusIcon: ComponentType<HeroIconProps>;
  export const PencilIcon: ComponentType<HeroIconProps>;
  export const TrashIcon: ComponentType<HeroIconProps>;
  export const DocumentIcon: ComponentType<HeroIconProps>;
  export const FolderIcon: ComponentType<HeroIconProps>;
  export const PhotoIcon: ComponentType<HeroIconProps>;
  export const VideoCameraIcon: ComponentType<HeroIconProps>;
  export const MusicalNoteIcon: ComponentType<HeroIconProps>;
  export const SpeakerWaveIcon: ComponentType<HeroIconProps>;
  export const MicrophoneIcon: ComponentType<HeroIconProps>;
  export const CameraIcon: ComponentType<HeroIconProps>;
  export const ComputerDesktopIcon: ComponentType<HeroIconProps>;
  export const DevicePhoneMobileIcon: ComponentType<HeroIconProps>;
  export const DeviceTabletIcon: ComponentType<HeroIconProps>;
  export const PrinterIcon: ComponentType<HeroIconProps>;
  export const WifiIcon: ComponentType<HeroIconProps>;
  export const BatteryIcon: ComponentType<HeroIconProps>;
  export const PowerIcon: ComponentType<HeroIconProps>;
  export const ArrowPathIcon: ComponentType<HeroIconProps>;
  export const ArrowsPointingOutIcon: ComponentType<HeroIconProps>;
  export const ArrowsPointingInIcon: ComponentType<HeroIconProps>;
  export const ArrowTopRightOnSquareIcon: ComponentType<HeroIconProps>;
  export const LinkIcon: ComponentType<HeroIconProps>;
  export const PaperClipIcon: ComponentType<HeroIconProps>;
  export const TagIcon: ComponentType<HeroIconProps>;
  export const FlagIcon: ComponentType<HeroIconProps>;
  export const BookmarkIcon: ComponentType<HeroIconProps>;
  export const ChatBubbleLeftIcon: ComponentType<HeroIconProps>;
  export const ChatBubbleLeftRightIcon: ComponentType<HeroIconProps>;
  export const PaperAirplaneIcon: ComponentType<HeroIconProps>;
  export const InboxIcon: ComponentType<HeroIconProps>;
  export const ArchiveBoxIcon: ComponentType<HeroIconProps>;
  export const ChevronDownIcon: ComponentType<HeroIconProps>;
  export const ChevronUpIcon: ComponentType<HeroIconProps>;
  export const ChevronLeftIcon: ComponentType<HeroIconProps>;
  export const ChevronDoubleRightIcon: ComponentType<HeroIconProps>;
  export const ChevronDoubleLeftIcon: ComponentType<HeroIconProps>;
  export const ChevronDoubleUpIcon: ComponentType<HeroIconProps>;
  export const ChevronDoubleDownIcon: ComponentType<HeroIconProps>;
  export const ArrowUpIcon: ComponentType<HeroIconProps>;
  export const ArrowDownIcon: ComponentType<HeroIconProps>;
  export const ArrowLeftIcon: ComponentType<HeroIconProps>;
  export const ArrowUpRightIcon: ComponentType<HeroIconProps>;
  export const ArrowDownRightIcon: ComponentType<HeroIconProps>;
  export const ArrowDownLeftIcon: ComponentType<HeroIconProps>;
  export const ArrowUpLeftIcon: ComponentType<HeroIconProps>;
  export const CursorArrowRaysIcon: ComponentType<HeroIconProps>;
  export const CursorArrowRippleIcon: ComponentType<HeroIconProps>;
  export const UsersIcon: ComponentType<HeroIconProps>;
  export const BuildingOfficeIcon: ComponentType<HeroIconProps>;
  export const BriefcaseIcon: ComponentType<HeroIconProps>;
  export const AcademicCapIcon: ComponentType<HeroIconProps>;
  export const BookOpenIcon: ComponentType<HeroIconProps>;
  export const DocumentTextIcon: ComponentType<HeroIconProps>;
  export const EyeIcon: ComponentType<HeroIconProps>;
  export const EyeSlashIcon: ComponentType<HeroIconProps>;
  export const LockClosedIcon: ComponentType<HeroIconProps>;
  export const LockOpenIcon: ComponentType<HeroIconProps>;
  export const GlobeAltIcon: ComponentType<HeroIconProps>;
  export const ShieldCheckIcon: ComponentType<HeroIconProps>;
  export const BoltIcon: ComponentType<HeroIconProps>;
  export const ChartBarIcon: ComponentType<HeroIconProps>;
  export const PresentationChartLineIcon: ComponentType<HeroIconProps>;
  export const BeakerIcon: ComponentType<HeroIconProps>;
  export const CpuChipIcon: ComponentType<HeroIconProps>;
  export const CircleStackIcon: ComponentType<HeroIconProps>;
  export const CloudIcon: ComponentType<HeroIconProps>;
  export const ServerIcon: ComponentType<HeroIconProps>;
  export const Square3Stack3DIcon: ComponentType<HeroIconProps>;
  export const RocketLaunchIcon: ComponentType<HeroIconProps>;
  export const CommandLineIcon: ComponentType<HeroIconProps>;
  export const CodeBracketIcon: ComponentType<HeroIconProps>;
  export const CodeBracketSquareIcon: ComponentType<HeroIconProps>;
  export const WindowIcon: ComponentType<HeroIconProps>;
  export const SquaresPlusIcon: ComponentType<HeroIconProps>;
  export const Squares2X2Icon: ComponentType<HeroIconProps>;
  export const TableCellsIcon: ComponentType<HeroIconProps>;
  export const ListBulletIcon: ComponentType<HeroIconProps>;
  export const QueueListIcon: ComponentType<HeroIconProps>;
  export const Bars4Icon: ComponentType<HeroIconProps>;
  export const Bars2Icon: ComponentType<HeroIconProps>;
  export const ViewColumnsIcon: ComponentType<HeroIconProps>;
  export const ViewfinderCircleIcon: ComponentType<HeroIconProps>;
  export const MagnifyingGlassPlusIcon: ComponentType<HeroIconProps>;
  export const MagnifyingGlassMinusIcon: ComponentType<HeroIconProps>;
  export const AdjustmentsHorizontalIcon: ComponentType<HeroIconProps>;
  export const AdjustmentsVerticalIcon: ComponentType<HeroIconProps>;
  export const SwatchIcon: ComponentType<HeroIconProps>;
  export const PaintBrushIcon: ComponentType<HeroIconProps>;
  export const SparklesIcon: ComponentType<HeroIconProps>;
  export const SunIcon: ComponentType<HeroIconProps>;
  export const MoonIcon: ComponentType<HeroIconProps>;
  export const FireIcon: ComponentType<HeroIconProps>;
  export const LightBulbIcon: ComponentType<HeroIconProps>;
  export const CubeIcon: ComponentType<HeroIconProps>;
  export const CubeTransparentIcon: ComponentType<HeroIconProps>;
  export const PuzzlePieceIcon: ComponentType<HeroIconProps>;
  export const WrenchScrewdriverIcon: ComponentType<HeroIconProps>;
  export const WrenchIcon: ComponentType<HeroIconProps>;
  export const ScrewdriverIcon: ComponentType<HeroIconProps>;
  export const HammerIcon: ComponentType<HeroIconProps>;
  export const ScissorsIcon: ComponentType<HeroIconProps>;
  export const ClipboardIcon: ComponentType<HeroIconProps>;
  export const ClipboardDocumentIcon: ComponentType<HeroIconProps>;
  export const ClipboardDocumentListIcon: ComponentType<HeroIconProps>;
  export const ClipboardDocumentCheckIcon: ComponentType<HeroIconProps>;
  export const DocumentDuplicateIcon: ComponentType<HeroIconProps>;
  export const DocumentArrowDownIcon: ComponentType<HeroIconProps>;
  export const DocumentArrowUpIcon: ComponentType<HeroIconProps>;
  export const DocumentPlusIcon: ComponentType<HeroIconProps>;
  export const DocumentMinusIcon: ComponentType<HeroIconProps>;
  export const DocumentCheckIcon: ComponentType<HeroIconProps>;
  export const DocumentXMarkIcon: ComponentType<HeroIconProps>;
  export const DocumentMagnifyingGlassIcon: ComponentType<HeroIconProps>;
  export const FolderOpenIcon: ComponentType<HeroIconProps>;
  export const FolderPlusIcon: ComponentType<HeroIconProps>;
  export const FolderMinusIcon: ComponentType<HeroIconProps>;
  export const FolderArrowDownIcon: ComponentType<HeroIconProps>;
  export const ArchiveBoxArrowDownIcon: ComponentType<HeroIconProps>;
  export const ArchiveBoxXMarkIcon: ComponentType<HeroIconProps>;
  export const InboxArrowDownIcon: ComponentType<HeroIconProps>;
  export const InboxStackIcon: ComponentType<HeroIconProps>;
  export const TrayIcon: ComponentType<HeroIconProps>;
  export const TrayArrowDownIcon: ComponentType<HeroIconProps>;
  export const TrayArrowUpIcon: ComponentType<HeroIconProps>;
}

declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  
  interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    color?: string;
    className?: string;
  }
  
  export const ArrowRight: ComponentType<IconProps>;
  export const ChevronRight: ComponentType<IconProps>;
  export const Check: ComponentType<IconProps>;
  export const X: ComponentType<IconProps>;
  export const Menu: ComponentType<IconProps>;
  export const User: ComponentType<IconProps>;
  export const Mail: ComponentType<IconProps>;
  export const Phone: ComponentType<IconProps>;
  export const MapPin: ComponentType<IconProps>;
  export const Calendar: ComponentType<IconProps>;
  export const Clock: ComponentType<IconProps>;
  export const Star: ComponentType<IconProps>;
  export const Heart: ComponentType<IconProps>;
  export const ThumbsUp: ComponentType<IconProps>;
  export const Share: ComponentType<IconProps>;
  export const Download: ComponentType<IconProps>;
  export const Upload: ComponentType<IconProps>;
  export const Search: ComponentType<IconProps>;
  export const Filter: ComponentType<IconProps>;
  export const Settings: ComponentType<IconProps>;
  export const Home: ComponentType<IconProps>;
  export const Info: ComponentType<IconProps>;
  export const AlertCircle: ComponentType<IconProps>;
  export const CheckCircle: ComponentType<IconProps>;
  export const XCircle: ComponentType<IconProps>;
  export const Plus: ComponentType<IconProps>;
  export const Minus: ComponentType<IconProps>;
  export const Edit: ComponentType<IconProps>;
  export const Trash: ComponentType<IconProps>;
  export const Save: ComponentType<IconProps>;
  export const Copy: ComponentType<IconProps>;
  export const Eye: ComponentType<IconProps>;
  export const EyeOff: ComponentType<IconProps>;
  export const Lock: ComponentType<IconProps>;
  export const Unlock: ComponentType<IconProps>;
  export const Globe: ComponentType<IconProps>;
  export const Shield: ComponentType<IconProps>;
  export const Zap: ComponentType<IconProps>;
  export const Target: ComponentType<IconProps>;
  export const TrendingUp: ComponentType<IconProps>;
  export const BarChart: ComponentType<IconProps>;
  export const PieChart: ComponentType<IconProps>;
  export const Activity: ComponentType<IconProps>;
  export const Users: ComponentType<IconProps>;
  export const Building: ComponentType<IconProps>;
  export const Briefcase: ComponentType<IconProps>;
  export const GraduationCap: ComponentType<IconProps>;
  export const BookOpen: ComponentType<IconProps>;
  export const FileText: ComponentType<IconProps>;
  export const Folder: ComponentType<IconProps>;
  export const Image: ComponentType<IconProps>;
  export const Video: ComponentType<IconProps>;
  export const Music: ComponentType<IconProps>;
  export const Headphones: ComponentType<IconProps>;
  export const Mic: ComponentType<IconProps>;
  export const Camera: ComponentType<IconProps>;
  export const Monitor: ComponentType<IconProps>;
  export const Smartphone: ComponentType<IconProps>;
  export const Tablet: ComponentType<IconProps>;
  export const Laptop: ComponentType<IconProps>;
  export const Printer: ComponentType<IconProps>;
  export const Wifi: ComponentType<IconProps>;
  export const Bluetooth: ComponentType<IconProps>;
  export const Battery: ComponentType<IconProps>;
  export const Power: ComponentType<IconProps>;
  export const Refresh: ComponentType<IconProps>;
  export const RotateCcw: ComponentType<IconProps>;
  export const RotateCw: ComponentType<IconProps>;
  export const Maximize: ComponentType<IconProps>;
  export const Minimize: ComponentType<IconProps>;
  export const ExternalLink: ComponentType<IconProps>;
  export const Link: ComponentType<IconProps>;
  export const Paperclip: ComponentType<IconProps>;
  export const Tag: ComponentType<IconProps>;
  export const Flag: ComponentType<IconProps>;
  export const Bookmark: ComponentType<IconProps>;
  export const MessageCircle: ComponentType<IconProps>;
  export const MessageSquare: ComponentType<IconProps>;
  export const Send: ComponentType<IconProps>;
  export const Inbox: ComponentType<IconProps>;
  export const Archive: ComponentType<IconProps>;
  export const Trash2: ComponentType<IconProps>;
  export const ChevronDown: ComponentType<IconProps>;
  export const ChevronUp: ComponentType<IconProps>;
  export const ChevronLeft: ComponentType<IconProps>;
  export const ChevronsRight: ComponentType<IconProps>;
  export const ChevronsLeft: ComponentType<IconProps>;
  export const ChevronsUp: ComponentType<IconProps>;
  export const ChevronsDown: ComponentType<IconProps>;
  export const ArrowUp: ComponentType<IconProps>;
  export const ArrowDown: ComponentType<IconProps>;
  export const ArrowLeft: ComponentType<IconProps>;
  export const ArrowUpRight: ComponentType<IconProps>;
  export const ArrowDownRight: ComponentType<IconProps>;
  export const ArrowDownLeft: ComponentType<IconProps>;
  export const ArrowUpLeft: ComponentType<IconProps>;
  export const CornerDownRight: ComponentType<IconProps>;
  export const CornerDownLeft: ComponentType<IconProps>;
  export const CornerUpRight: ComponentType<IconProps>;
  export const CornerUpLeft: ComponentType<IconProps>;
  export const CornerRightDown: ComponentType<IconProps>;
  export const CornerRightUp: ComponentType<IconProps>;
  export const CornerLeftDown: ComponentType<IconProps>;
  export const CornerLeftUp: ComponentType<IconProps>;
  export const Move: ComponentType<IconProps>;
  export const MousePointer: ComponentType<IconProps>;
  export const MousePointer2: ComponentType<IconProps>;
  export const Navigation: ComponentType<IconProps>;
  export const Navigation2: ComponentType<IconProps>;
  export const Crosshair: ComponentType<IconProps>;
  export const GitBranch: ComponentType<IconProps>;
  export const GitCommit: ComponentType<IconProps>;
  export const GitMerge: ComponentType<IconProps>;
  export const GitPullRequest: ComponentType<IconProps>;
  export const Github: ComponentType<IconProps>;
  export const Gitlab: ComponentType<IconProps>;
  export const Twitter: ComponentType<IconProps>;
  export const Facebook: ComponentType<IconProps>;
  export const Instagram: ComponentType<IconProps>;
  export const Linkedin: ComponentType<IconProps>;
  export const Youtube: ComponentType<IconProps>;
  export const Twitch: ComponentType<IconProps>;
  export const Slack: ComponentType<IconProps>;
  export const Discord: ComponentType<IconProps>;
  export const Figma: ComponentType<IconProps>;
  export const Framer: ComponentType<IconProps>;
  export const Chrome: ComponentType<IconProps>;
  export const Firefox: ComponentType<IconProps>;
  export const Safari: ComponentType<IconProps>;
  export const Edge: ComponentType<IconProps>;
}

declare module 'next/server' {
  export class NextRequest extends Request {
    url: string;
    nextUrl: {
      pathname: string;
      search: string;
      searchParams: URLSearchParams;
      origin: string;
    };
    cookies: {
      get: (name: string) => { value: string } | undefined;
      set: (name: string, value: string) => void;
    };
    headers: Headers;
    json(): Promise<any>;
  }
  
  export class NextResponse extends Response {
    static json(body: any, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static next(): NextResponse;
    static rewrite(url: string | URL): NextResponse;
  }
}

declare module 'lucide-react' {
  import { FC } from 'react';
  
  interface IconProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export const AlertOctagon: FC<IconProps>;
  export const AlertTriangle: FC<IconProps>;
  export const ArrowRight: FC<IconProps>;
  export const Award: FC<IconProps>;
  export const BarChart3: FC<IconProps>;
  export const BookOpen: FC<IconProps>;
  export const Brain: FC<IconProps>;
  export const CheckCircle: FC<IconProps>;
  export const CheckCircle2: FC<IconProps>;
  export const ChevronLeft: FC<IconProps>;
  export const Clock: FC<IconProps>;
  export const Crown: FC<IconProps>;
  export const Database: FC<IconProps>;
  export const Download: FC<IconProps>;
  export const FileText: FC<IconProps>;
  export const Headphones: FC<IconProps>;
  export const Home: FC<IconProps>;
  export const Lightbulb: FC<IconProps>;
  export const Mail: FC<IconProps>;
  export const Settings: FC<IconProps>;
  export const Share2: FC<IconProps>;
  export const Shield: FC<IconProps>;
  export const Sparkles: FC<IconProps>;
  export const Star: FC<IconProps>;
  export const Target: FC<IconProps>;
  export const TrendingUp: FC<IconProps>;
  export const Users: FC<IconProps>;
  export const Zap: FC<IconProps>;
}
