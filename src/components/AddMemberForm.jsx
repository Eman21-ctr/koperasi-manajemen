import React, { useState } from 'react';
import { SavingType } from '../lib/types.js'; // Pastikan path benar
import { SIMPANAN_POKOK_AMOUNT, SIMPANAN_WAJIB_AMOUNT } from '../constants.js'; // Impor konstanta
import { UserPlusIcon } from './Icons.jsx'; // Asumsi path benar
import { formatCurrency, getTodayDateString } from '../lib/helpers.js'; // Impor helper

const AddMemberForm = ({ onAddMember, onCancel, members }) => { // Ditambahkan 'members' untuk validasi ID
  const [formData, setFormData] = useState({
      memberNumber: '',
      name: '',
      idNumber: '',
      pob: '',
      dob: '',
      gender: 'Laki-laki',
      address: '',
      phone: '',
      occupation: '',
      heirName: '',
      heirRelationship: '',
      joinDate: getTodayDateString(),
  });
  
  const handleChange = (e) => {
      const { id, value } = e.target;
      setFormData(prev => ({...prev, [id]: value}));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi sederhana
    for(const key in formData) {
        if(!formData[key]) {
            alert(`Kolom "${key}" harus diisi.`);
            return;
        }
    }
    
    // Validasi Nomor Anggota unik
    if (members.some(member => member.id === formData.memberNumber.trim())) {
        alert(`Nomor Anggota "${formData.memberNumber}" sudah digunakan. Harap gunakan nomor lain.`);
        return;
    }

    const memberId = formData.memberNumber.trim();
    const joinDate = new Date(formData.joinDate);
    const dob = new Date(formData.dob);

    const newMember = {
      id: memberId,
      name: formData.name,
      idNumber: formData.idNumber,
      pob: formData.pob,
      dob: dob,
      gender: formData.gender,
      address: formData.address,
      phone: formData.phone,
      occupation: formData.occupation,
      heirName: formData.heirName,
      heirRelationship: formData.heirRelationship,
      joinDate: joinDate,
    };

    const initialSavings = [
      {
        id: crypto.randomUUID(),
        memberId,
        date: joinDate,
        type: SavingType.POKOK,
        amount: SIMPANAN_POKOK_AMOUNT,
      },
      {
        id: crypto.randomUUID(),
        memberId,
        date: joinDate,
        type: SavingType.WAJIB,
        amount: SIMPANAN_WAJIB_AMOUNT,
      },
    ];
    
    const receipt = {
        memberName: formData.name,
        date: new Date(),
        items: [
            { description: SavingType.POKOK, amount: SIMPANAN_POKOK_AMOUNT },
            { description: `${SavingType.WAJIB} (${joinDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })})`, amount: SIMPANAN_WAJIB_AMOUNT },
        ],
        total: SIMPANAN_POKOK_AMOUNT + SIMPANAN_WAJIB_AMOUNT
    };

    onAddMember(newMember, initialSavings, receipt);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 px-4 sm:px-0">Pendaftaran Anggota Baru</h2>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
            
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 px-2">Informasi Keanggotaan</legend>
                 <div>
                    <label htmlFor="memberNumber" className="block text-sm font-medium text-gray-700">Nomor Anggota</label>
                    <input type="text" id="memberNumber" value={formData.memberNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                </div>
                <div>
                    <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">Tanggal Bergabung</label>
                    <input type="date" id="joinDate" value={formData.joinDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                </div>
            </fieldset>

            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 px-2">Data Pribadi</legend>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input type="text" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                </div>
                 <div>
                    <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">No. KTP / Identitas</label>
                    <input type="text" id="idNumber" value={formData.idNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                </div>
                <div>
                    <label htmlFor="pob" className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
                    <input type="text" id="pob" value={formData.pob} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                </div>
                 <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                    <input type="date" id="dob" value={formData.dob} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                    <select id="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required>
                        <option>Laki-laki</option>
                        <option>Perempuan</option>
                    </select>
                </div>
            </fieldset>

            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-md">
                 <legend className="text-lg font-medium text-gray-900 px-2">Info Kontak & Pekerjaan</legend>
                 <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                    <textarea id="address" value={formData.address} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                </div>
                 <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                </div>
                <div>
                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Pekerjaan</label>
                    <input type="text" id="occupation" value={formData.occupation} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                </div>
            </fieldset>

             <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 px-2">Data Ahli Waris</legend>
                 <div>
                    <label htmlFor="heirName" className="block text-sm font-medium text-gray-700">Nama Ahli Waris</label>
                    <input type="text" id="heirName" value={formData.heirName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                </div>
                 <div>
                    <label htmlFor="heirRelationship" className="block text-sm font-medium text-gray-700">Hubungan dengan Ahli Waris</label>
                    <input type="text" id="heirRelationship" value={formData.heirRelationship} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                </div>
            </fieldset>

            <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900">Setoran Awal</h3>
                <p className="text-sm text-gray-500">Sesuai dengan tanggal bergabung yang dipilih.</p>
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md"><span className="text-gray-600">{SavingType.POKOK}</span><span className="font-semibold text-gray-800">{formatCurrency(SIMPANAN_POKOK_AMOUNT)}</span></div>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md"><span className="text-gray-600">{SavingType.WAJIB} (Bulan Pertama)</span><span className="font-semibold text-gray-800">{formatCurrency(SIMPANAN_WAJIB_AMOUNT)}</span></div>
                     <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md border-t-2 border-gray-300"><span className="font-bold text-gray-800">Total Setoran Awal</span><span className="font-bold text-red-600 text-lg">{formatCurrency(SIMPANAN_POKOK_AMOUNT + SIMPANAN_WAJIB_AMOUNT)}</span></div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
                <button type="submit" className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"><UserPlusIcon className="w-5 h-5"/>Simpan & Daftarkan</button>
            </div>
        </form>
    </div>
  );
};

export default AddMemberForm;