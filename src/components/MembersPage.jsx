import React, { useState, useMemo } from 'react';
import { downloadMembersPdf, downloadMembersXlsx } from '../services/printService';
import { UserPlusIcon, DownloadIcon } from './Icons.jsx';

const MembersPage = ({ members, onViewMember, onAddMemberClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = useMemo(() => {
    if (!searchTerm) return members;
    const lowercasedTerm = searchTerm.toLowerCase();
    return members.filter(m =>
      m.name.toLowerCase().includes(lowercasedTerm) ||
      m.memberNumber.toLowerCase().includes(lowercasedTerm)
    );
  }, [members, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Daftar Anggota</h2>
            <p className="mt-1 text-sm text-gray-500">Kelola data anggota koperasi.</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <button
              onClick={onAddMemberClick}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <UserPlusIcon className="w-5 h-5 mr-2"/>
              Tambah Anggota Baru
            </button>
          </div>
        </div>

        {/* Actions Bar (Search and Download) */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-1/2 md:w-1/3">
                 <input 
                    type="text" 
                    placeholder="Cari nama atau no. anggota..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
            </div>
            <div className="flex items-center gap-3">
                 <button onClick={() => downloadMembersXlsx(filteredMembers)} className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600">
                    <DownloadIcon className="w-4 h-4"/>
                    Unduh (.xlsx)
                </button>
                 <button onClick={() => downloadMembersPdf(filteredMembers)} className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600">
                    <DownloadIcon className="w-4 h-4"/>
                    Unduh (.pdf)
                </button>
            </div>
        </div>

        {/* Members Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Anggota</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pekerjaan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Telepon</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Detail</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.length > 0 ? filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onViewMember(member.id)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.occupation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <span className="text-red-600 hover:text-red-800">Detail</span>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={5} className="text-center py-10 text-gray-500">
                           {searchTerm ? 'Anggota tidak ditemukan.' : 'Belum ada anggota terdaftar.'}
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
