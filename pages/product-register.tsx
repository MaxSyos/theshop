import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Breadcrumb from '../components/UI/Breadcrumb';
import Input from '../components/UI/Input';
import { useLanguage } from '../hooks/useLanguage';
import { toast } from 'react-toastify';

export default function ProductRegister() {
  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: '',
    discount: '',
    starRating: 0,
    description: '',
    category: '',
    subCategory: '',
    image: [''],
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }


  function handleImageChange(idx: number, value: string) {
    const newUrls = [...form.image];
    newUrls[idx] = value;
    setForm({ ...form, image: newUrls });
  }

  function addImageField() {
    setForm({ ...form, image: [...form.image, ''] });
  }

  function removeImageField(idx: number) {
    if (form.image.length === 1) return;
    const newUrls = form.image.filter((_, i) => i !== idx);
    setForm({ ...form, image: newUrls });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    // Garante que category seja array
    const payload = {
      ...form,
      price: Number(form.price),
      discount: Number(form.discount),
      starRating: Number(form.starRating),
      category: Array.isArray(form.category)
        ? form.category
        : form.category
        ? form.category.split(',').map((c) => c.trim()).filter(Boolean)
        : [],
    };
    const res = await fetch('/api/sanity/registerProduct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);
    setResult(data.message || 'Erro ao cadastrar produto');
    if (res.ok) {
      toast.success(t['productRegistered'] || 'Produto cadastrado com sucesso!', { position: 'top-right' });
    }
  }

  // Função para criar o Custom Type via API
  async function handleCreateCustomType() {
    setLoading(true);
    try {
      const res = await fetch('/api/prismic/migration/triggerCustomType', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Custom Type criado com sucesso!', { position: 'top-right' });
      } else {
        toast.error(data.message || 'Erro ao criar Custom Type', { position: 'top-right' });
      }
    } catch (err: any) {
      toast.error('Erro ao criar Custom Type', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  }

  // Estado para login/logout
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Função para login no Prismic via OAuth (GitHub)
  async function handlePrismicLogin() {
    setLoginLoading(true);
    try {
      // Redireciona para o login do Prismic (OAuth GitHub)
      window.open('https://auth.prismic.io/login', '_blank', 'width=600,height=700');
      toast.info('Faça login com sua conta do GitHub na janela aberta.', { position: 'top-right' });
      // Simulação: aguarda usuário logar manualmente
      setTimeout(() => {
        setIsLoggedIn(true);
        toast.success('Login realizado com sucesso!', { position: 'top-right' });
        setLoginLoading(false);
      }, 4000);
    } catch (err: any) {
      toast.error('Erro ao iniciar login no Prismic.', { position: 'top-right' });
      setLoginLoading(false);
    }
  }

  function handlePrismicLogout() {
    setIsLoggedIn(false);
    toast.info('Logout realizado.', { position: 'top-right' });
  }

  return (
    <>
      {/* Botão de login/logout dinâmico */}
      <div className="w-full flex justify-center mt-8 px-2">
        {!isLoggedIn ? (
          <button
            onClick={handlePrismicLogin}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors duration-200 mb-4"
            disabled={loginLoading}
          >
            {loginLoading ? 'Entrando...' : 'Login com GitHub (Prismic)'}
          </button>
        ) : (
          <button
            onClick={handlePrismicLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors duration-200 mb-4"
          >
            Logout
          </button>
        )}
      </div>
      {/* Botão fora do card */}
      <div className="w-full flex justify-center mt-0 px-2">
        <button
          onClick={handleCreateCustomType}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors duration-200 mb-4"
          disabled={loading}
        >
          {loading ? 'Criando Custom Type...' : 'Criar Custom Type no Prismic'}
        </button>
      </div>
      <div className="w-full flex justify-center mt-0 px-2">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-lg xl:max-w-md">
          <Breadcrumb categoryName={t.product} productName={t['registerProduct'] || 'Cadastro de Produto'} />
          <div className="bg-white dark:bg-palette-card rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mt-4">
            <h1 className="text-2xl font-bold mb-6 text-palette-mute text-center">{t['registerProduct'] || 'Cadastro de Produto'}</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div className="md:col-span-2">
                <Input id="name" type="text" placeholder="name" value={form.name} onChange={handleChange} required />
              </div>
              <Input id="brand" type="text" placeholder="brand" value={form.brand} onChange={handleChange} required />
              <Input id="price" type="number" placeholder="price" value={form.price} onChange={handleChange} required />
              <Input id="category" type="text" placeholder="category" value={form.category} onChange={handleChange} required />
              <Input id="discount" type="number" placeholder="discount" value={form.discount} onChange={handleChange} />
              <Input id="starRating" type="number" placeholder="starRating" minLength={1} maxLength={1} value={String(form.starRating)} onChange={handleChange} />
              <Input id="subCategory" type="text" placeholder="subCategory" value={form.subCategory} onChange={handleChange} />
              <div className="md:col-span-2">
                <label className="block font-semibold text-palette-mute mb-2" htmlFor="image">
                  {t['images'] || 'Imagens (URLs ou assetId do Sanity)'}
                </label>
                {form.image.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <input
                      type="url"
                      name={`image${idx}`}
                      value={url}
                      onChange={e => handleImageChange(idx, e.target.value)}
                      placeholder={t['imageUrl'] || 'URL ou assetId da imagem'}
                      className="w-full py-2 px-4 border-[1px] border-gainsboro bg-palette-card outline-none rounded-lg shadow-md"
                    />
                    {form.image.length > 1 && (
                      <button type="button" onClick={() => removeImageField(idx)} className="text-red-600 font-bold px-2">X</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addImageField} className="text-blue-600 font-bold mt-2">+ {t['addImage'] || 'Adicionar Imagem'}</button>
              </div>
              <div className="relative mb-4 md:col-span-2">
                <label className="mt-4 absolute -top-[30%] ltr:left-3 rtl:right-3 bg-palette-card p-[0.3rem] whitespace-nowrap" htmlFor="description">
                  {t['description']}
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder={t['description']}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full py-4 px-6 border-[1px] border-gainsboro bg-palette-card outline-none rounded-lg shadow-md min-h-[100px]"
                />
              </div>
              <button type="submit" className="md:col-span-2 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold transition-colors duration-200" disabled={loading}>
                {loading ? t['registering'] || 'Cadastrando...' : t['registerProduct'] || 'Cadastrar Produto'}
              </button>
            </form>
            {result && <div className="mt-4 text-green-600 text-center">{result}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
