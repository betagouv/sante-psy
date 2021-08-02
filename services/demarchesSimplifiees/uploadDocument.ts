import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mime from 'mime-types';
import axios from 'axios';
import graphql from './buildRequest';
import { FileInfo } from '../../types/DemarcheSimplifiee';

const md5 = (value: Buffer): string => crypto.createHash('md5').update(value).digest('base64');
const getFileInfo = (file: string): FileInfo => {
  const buffer = fs.readFileSync(file);
  return {
    filename: path.basename(file),
    byteSize: buffer.byteLength,
    checksum: md5(buffer),
    contentType: mime.lookup(file),
  };
};

const uploadFile = async (file: string, dossierId: string): Promise<string> => {
  const fileInfo = getFileInfo(file);
  const { createDirectUpload } = await graphql.createDirectUpload(fileInfo, dossierId);

  await axios.put(
    createDirectUpload.directUpload.url,
    fs.readFileSync(file),
    {
      headers: JSON.parse(createDirectUpload.directUpload.headers),
    },
  );

  return createDirectUpload.directUpload.signedBlobId;
};

export default uploadFile;
