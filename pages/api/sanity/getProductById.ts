import type { NextApiRequest, NextApiResponse } from 'next';
import { client as sanityClient } from '../../../lib/sanityClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: 'ID do produto não informado' });
  }
  try {
    const query = `*[_type == "product" && _id == $id][0]`;
    const product = await sanityClient.fetch(query, { id });
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    return res.status(200).json(product);
  } catch (error: any) {
    return res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
  }
}
