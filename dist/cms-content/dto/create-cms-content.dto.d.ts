export declare class CreateCmsContentDto {
    heroTitle?: string;
    heroSubtitle?: string;
    heroImages?: string[];
    aboutTitle?: string;
    aboutText?: string;
    aboutImages?: string[];
    sliderImages?: string[];
    detailsTitle?: string;
    detailsContent?: string;
    tabs?: {
        title: string;
        content: string;
        images: string[];
    }[];
    fontFamily?: string;
    fontSize?: string;
    textColor?: string;
    bgColor?: string;
    featuredSections?: Array<{
        title: string;
        description: string;
        imageSrc: string;
        imageAlt?: string;
        textBgColor?: string;
        isImageRight?: boolean;
    }>;
}
