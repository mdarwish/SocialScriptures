
interface SocialAgregates {
   likes: number;
   comments: number;
   links: number;
   photos: number;
   videos: number;
   shares: number;
}

interface QVerseInterface {
   path: string;
   version: string;
   b_orig_id: string;
   type: string;
   timestamp: string;
   gsort: number;
   testament: string;
   message: string;
   number: string;
   en1: string;
   bid: string;
   verse: number;
   host: string;
   chapter: number;
   ar_simple: string;
   social_agregates: SocialAgregates;
}

interface VerseContainer {
   _index: string;
   _type: string;
   _id: string;
   _score: number;
   _source: VerseInterface;
}
