// import { Dexie } from "dexie";
// const db = new Dexie('conversations');

// type IConversation = {
//     id?: number;
//     chat_type: 'PERSONAL',
//     metadata: any,
//     last_message?: IMessage,
//     messages: IMessage[],
//     members: conversationMember[],
//     created_at: Date,
//     updated_at: Date,
// }

// type IMessage = {
//     id: string;
//     chat_id: string;
//     sender_id: string;
//     content: string;
//     metadata: Record<string, any>;
//     content_type: messageContentType;
//     created_at: Date;
//     updated_at: Date;
//     seen_by: string[],
//     seen_by_me: boolean,
//     sent_by_me: boolean,
//     sender: conversationMember['user'],
// }

// enum messageContentType {
//     TEXT = 'TEXT',
//     IMAGE = 'IMAGE',
//     DOCUMENT = 'DOCUMENT',
// }

// interface conversationMember {
//     user_id: string,
//     user: {
//         id: string,
//         username: string,
//         fullname: string,
//         public_key: string,
//     },
// }

// class ConversationDB extends Dexie {
//     // Declare implicit table properties.
//     // (just to inform Typescript. Instantiated by Dexie in stores() method)
//     contacts!: Dexie.Table<IConversation, number>; // number = type of the primkey
//     //...other tables goes here...

//     constructor() {
//         super("ConversationDB");
//         this.version(1).stores({
//             conversations: '++id, , first, last',
//             //...other tables goes here...
//         });
//     }
// }
