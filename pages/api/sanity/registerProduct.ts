import type { NextApiRequest, NextApiResponse } from 'next';
import { client as sanityClient } from '../../../lib/sanityClient';
import sanityClientLib from '@sanity/client';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const {
      name,
      brand,
      price,
      discount,
      starRating,
      description,
      category,
      subCategory,
      image = [],
    } = req.body;

    // Função para upload de imagem no Sanity
    async function uploadImageToSanity(url: string) {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      const uploadClient = sanityClientLib({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
        token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
        useCdn: false,
      });
      const asset = await uploadClient.assets.upload('image', buffer, { filename: 'upload.jpg' });
      return asset._id;
    }

    // Monta array de imagens: se for assetId, usa direto; se for URL, faz upload
    const imageRefs = [];
    for (const img of image) {
      if (!img) continue;
      if (img.startsWith('image-')) {
        imageRefs.push({ _type: 'image', asset: { _type: 'reference', _ref: img } });
      } else if (img.startsWith('http')) {
        const assetId = await uploadImageToSanity(img);
        imageRefs.push({ _type: 'image', asset: { _type: 'reference', _ref: assetId } });
      }
    }

    // Cria documento no Sanity
    const doc = {
      _type: 'product',
      name,
      brand,
      price,
      discount,
      starRating,
      description,
      category,
      subCategory,
      image: imageRefs,
    };

    const result = await sanityClient.create(doc);
    return res.status(201).json({ message: 'Produto registrado com sucesso!', result });
  } catch (error: any) {
    return res.status(500).json({ message: 'Erro ao registrar produto', error: error.message });
  }
}
