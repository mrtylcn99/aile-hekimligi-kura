import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FiDownload, FiFileText, FiUser, FiBriefcase, FiPlus } from 'react-icons/fi';
import '../styles/application-form.css';

const ApplicationForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [pdfPath, setPdfPath] = useState(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) {
      setValue('ad', user.ad);
      setValue('soyad', user.soyad);
      setValue('tc_kimlik', user.tc_kimlik);
      setValue('telefon', user.telefon);
      setValue('email', user.email);
      setValue('dogum_tarihi', user.dogum_tarihi);
      setValue('dogum_yeri', user.dogum_yeri);
      setValue('sicil_no', user.sicil_no);
      setValue('unvan', user.unvan);
      setValue('mezun_universite', user.mezun_universite);
      setValue('uyum_egitimi_sertifika', user.uyum_egitimi_sertifika);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    if (!user.telefon_dogrulanmis) {
      toast.error('Başvuru yapmak için telefon numaranızı doğrulamalısınız');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post('/api/pdf/basvuru-formu', data);

      if (response.data.success) {
        toast.success('Başvuru formu oluşturuldu');
        setFormData(data);
        setPdfPath(response.data.pdfPath);
      }
    } catch (error) {
      toast.error('Form oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (pdfPath) {
      const fileName = pdfPath.split('/').pop();
      const link = document.createElement('a');
      link.href = `/exports/${fileName}`;
      link.download = fileName;
      link.click();
    }
  };

  return (
    <div className="application-form-container">
      <div className="form-header-card">
        <div className="emoji-icon">📝</div>
        <h1 style={{ fontSize: '36px', marginTop: '20px', marginBottom: '10px' }}>Başvuru Formu</h1>
        <p style={{ fontSize: '20px', opacity: 0.95 }}>🏥 Aile Hekimliği Kura Başvurusu</p>
      </div>

      {!user.telefon_dogrulanmis && (
        <div className="modern-card" style={{
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          color: 'white',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span className="emoji-md">⚠️</span>
            <div>
              <strong>Telefon Doğrulaması Gerekli!</strong>
              <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
                Başvuru formu oluşturabilmek için öncelikle telefon numaranızı doğrulamanız gerekmektedir.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="modern-card">
          <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', color: '#333' }}>
            <span className="emoji-md" style={{ marginRight: '10px' }}>👤</span>
            Kişisel Bilgiler
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="modern-label">🆔 TC Kimlik No</label>
              <input
                type="text"
                className="modern-input"
                {...register('tc_kimlik')}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="modern-label">✏️ Ad</label>
              <input
                type="text"
                className="modern-input"
                {...register('ad', { required: 'Ad zorunludur' })}
              />
              {errors.ad && <span className="error-message">{errors.ad.message}</span>}
            </div>

            <div className="form-group">
              <label className="modern-label">✏️ Soyad</label>
              <input
                type="text"
                className="modern-input"
                {...register('soyad', { required: 'Soyad zorunludur' })}
              />
              {errors.soyad && <span className="error-message">{errors.soyad.message}</span>}
            </div>

            <div className="form-group">
              <label className="modern-label">📅 Doğum Tarihi</label>
              <input
                type="date"
                className="modern-input"
                {...register('dogum_tarihi')}
              />
            </div>

            <div className="form-group">
              <label className="modern-label">📍 Doğum Yeri</label>
              <input
                type="text"
                className="modern-input"
                {...register('dogum_yeri')}
              />
            </div>

            <div className="form-group">
              <label className="modern-label">📱 Telefon</label>
              <input
                type="text"
                className="modern-input"
                {...register('telefon', { required: 'Telefon zorunludur' })}
              />
              {errors.telefon && <span className="error-message">{errors.telefon.message}</span>}
            </div>

            <div className="form-group">
              <label className="modern-label">📧 E-posta</label>
              <input
                type="email"
                className="modern-input"
                {...register('email', { required: 'E-posta zorunludur' })}
              />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>
          </div>
        </div>

        <div className="modern-card">
          <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', color: '#333' }}>
            <span className="emoji-md" style={{ marginRight: '10px' }}>👨‍⚕️</span>
            Mesleki Bilgiler
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="modern-label">🔖 Sicil No</label>
              <input
                type="text"
                className="modern-input"
                {...register('sicil_no')}
                placeholder="Doktor sicil numaranız"
              />
            </div>

            <div className="form-group">
              <label className="modern-label">🎓 Ünvan</label>
              <select
                className="modern-input"
                {...register('unvan', { required: 'Ünvan seçimi zorunludur' })}
              >
                <option value="">Seçiniz</option>
                <option value="Aile Hekimliği Uzmanı">Aile Hekimliği Uzmanı</option>
                <option value="Uzman Tabip">Uzman Tabip</option>
                <option value="Pratisyen">Pratisyen</option>
              </select>
              {errors.unvan && <span className="error-message">{errors.unvan.message}</span>}
            </div>

            <div className="form-group">
              <label className="modern-label">🏫 Mezun Olduğu Üniversite</label>
              <input
                type="text"
                className="modern-input"
                {...register('mezun_universite')}
              />
            </div>

            <div className="form-group">
              <label className="modern-label">📜 Uyum Eğitimi Sertifika No</label>
              <input
                type="text"
                className="modern-input"
                {...register('uyum_egitimi_sertifika')}
                placeholder="Varsa giriniz"
              />
            </div>
          </div>
        </div>

        <div className="modern-card">
          <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', color: '#333' }}>
            <span className="emoji-md" style={{ marginRight: '10px' }}>➕</span>
            Ek Bilgiler
          </h3>

          <div className="form-group">
            <label className="modern-label">🗺️ Tercih Edilen İlçeler</label>
            <input
              type="text"
              className="modern-input"
              {...register('tercih_ilceler')}
              placeholder="Örn: Kadıköy, Üsküdar, Beşiktaş (virgülle ayırın)"
            />
          </div>

          <div className="form-group">
            <label className="modern-label">💭 Açıklama / Notlar</label>
            <textarea
              className="modern-input"
              {...register('aciklama')}
              rows="4"
              placeholder="Varsa eklemek istediğiniz notlar"
              style={{ borderRadius: '20px', resize: 'vertical' }}
            />
          </div>
        </div>

        <div className="modern-card" style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="submit"
            className="btn-modern btn-gradient-blue"
            disabled={loading || !user.telefon_dogrulanmis}
            style={{ minWidth: '200px' }}
          >
            {loading ? (
              <>
                <div className="spinner-modern" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '10px' }}></div>
                İşleniyor...
              </>
            ) : (
              <>🚀 Başvuru Formu Oluştur</>
            )}
          </button>

          {pdfPath && (
            <button
              type="button"
              className="btn-modern btn-gradient-green"
              onClick={downloadPDF}
              style={{ minWidth: '200px' }}
            >
              <FiDownload style={{ marginRight: '5px' }} /> 📄 PDF İndir
            </button>
          )}
        </div>
      </form>

      {formData && pdfPath && (
        <div className="modern-card" style={{
          background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
          color: 'white',
          textAlign: 'center',
          marginTop: '30px'
        }}>
          <span className="emoji-lg">✅</span>
          <h3 style={{ marginTop: '20px', marginBottom: '15px' }}>
            Başvuru Formu Başarıyla Oluşturuldu!
          </h3>
          <p style={{ fontSize: '16px', opacity: 0.95, marginBottom: '10px' }}>
            📋 Formunuz başarıyla oluşturuldu ve kaydedildi.
          </p>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>
            🖨️ PDF dosyanızı indirip çıktı alabilir ve ilgili kuruma teslim edebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;