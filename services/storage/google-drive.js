import { google } from 'googleapis';
import stream from 'stream';
import dotenv from 'dotenv';
dotenv.config();

const FOLDER_IDS = {
    food: '1z4BkcSZmbJ1tLhgMR0R9tuWYeeLDJxzU',
    bodycare: '1KYvHa7ROdM2cNTcC-lMWNawK22OPZ84S',
    inhale: '1Nh9UudqXIVZQNT2q9J-Qe9f8Xh0No2DT',
    beverage: '12ZSjdVHgRKn77RjpzsTWXvjnDInNXMSD',
    other: '1w8CFxLMiILTQ54UuUSkz3fSDeVcmarpv'
};

class GoogleDriveService {
    constructor() {
        const credentials = JSON.parse(process.env.GOOGLE_DRIVE_KEY);

        this.auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive']
        });

        this.driveService = google.drive({ version: 'v3', auth: this.auth });
    }

    async uploadImage(buffer, fileName, productType) {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);

        const folderId = FOLDER_IDS[productType.toLowerCase()] || FOLDER_IDS.other;

        const fileMetadata = {
            name: fileName,
            parents: [folderId]
        };

        const media = {
            mimeType: 'image/jpeg',
            body: bufferStream
        };

        const file = await this.driveService.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id,webViewLink'
        });

        // Make the file public
        await this.driveService.permissions.create({
            fileId: file.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        // Get direct image URL
        const imageUrl = `https://drive.google.com/uc?export=view&id=${file.data.id}`;
        return imageUrl;
    }
}

export default new GoogleDriveService();
