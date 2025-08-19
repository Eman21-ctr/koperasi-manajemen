import React, { useState } from 'react';
import { MenuIcon, XIcon } from './Icons.jsx'; // Asumsi path benar

const Header = ({ onNavigate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Fungsi handleNav sudah bersih dari TypeScript
    const handleNav = (view) => {
        onNavigate(view);
        setIsMenuOpen(false); // Otomatis tutup menu setelah navigasi di mobile
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    
                    {/* Tombol Menu Mobile (Kiri) */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-gray-900">
                            {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Logo/Brand (Tengah di Mobile, Kiri di Desktop) */}
                    <div className="flex-1 flex justify-center md:justify-start">
                         <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleNav('dashboard')}>
                            <div className="w-12 h-12 bg-red-600 flex items-center justify-center font-bold text-white text-3xl rounded-md">
                            MP
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-gray-900">Koperasi Desa Merah Putih</h1>
                                <p className="text-sm text-gray-500">Penfui Timur</p>
                            </div>
                        </div>
                    </div>


                    {/* Navigasi Desktop (Kanan) */}
                    <nav className="hidden md:flex items-center gap-6">
                        <button onClick={() => handleNav('dashboard')} className="text-gray-600 hover:text-red-600 font-medium transition-colors">Dashboard</button>
                        <button onClick={() => handleNav('membersPage')} className="text-gray-600 hover:text-red-600 font-medium transition-colors">Anggota</button>
                        <button onClick={() => handleNav('transactionsPage')} className="text-gray-600 hover:text-red-600 font-medium transition-colors">Setor Simpanan</button>
                        <button onClick={() => handleNav('loansPage')} className="text-gray-600 hover:text-red-600 font-medium transition-colors">Pinjaman</button>
                        <button onClick={() => handleNav('reportsPage')} className="text-gray-600 hover:text-red-600 font-medium transition-colors">Laporan</button>
                    </nav>

                    {/* Spacer untuk menyeimbangkan header di mobile */}
                     <div className="md:hidden w-6 h-6"></div>
                </div>
            </div>

            {/* Menu Mobile (Dropdown) */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <nav className="flex flex-col p-4 gap-2">
                        <button onClick={() => handleNav('dashboard')} className="text-gray-700 hover:bg-gray-100 p-3 rounded-md text-left font-medium">Dashboard</button>
                        <button onClick={() => handleNav('membersPage')} className="text-gray-700 hover:bg-gray-100 p-3 rounded-md text-left font-medium">Anggota</button>
                        <button onClick={() => handleNav('transactionsPage')} className="text-gray-700 hover:bg-gray-100 p-3 rounded-md text-left font-medium">Setor Simpanan</button>
                        <button onClick={() => handleNav('loansPage')} className="text-gray-700 hover:bg-gray-100 p-3 rounded-md text-left font-medium">Pinjaman</button>
                        <button onClick={() => handleNav('reportsPage')} className="text-gray-700 hover:bg-gray-100 p-3 rounded-md text-left font-medium">Laporan</button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;