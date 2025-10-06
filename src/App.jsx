import React, { useState, useEffect, useCallback } from 'react';
import { db } from './lib/firebase.js'; // Diperbaiki
import { auth } from './lib/firebase.js';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    doc, 
    setDoc, 
    writeBatch,
    updateDoc
} from 'firebase/firestore';

import { LoanStatus } from './lib/types.js'; // Diperbaiki
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import AddMemberForm from './components/AddMemberForm.jsx';
import MemberDetail from './components/MemberDetail.jsx';
import ReceiptModal from './components/ReceiptModal.jsx';
import SavingsPage from './components/SavingsPage.jsx';
import MembersPage from './components/MembersPage.jsx';
import ReportsPage from './components/ReportsPage.jsx';
import LoansPage from './components/LoansPage.jsx';
import LoanDetail from './components/LoanDetail.jsx';

const App = () => {
  const [members, setMembers] = useState([]);
  const [savings, setSavings] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loanPayments, setLoanPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState('dashboard');
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Auto login dengan Firebase Authentication
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      setAuthLoading(false);
    } else {
      // Jika belum login, login otomatis sebagai anonymous
      signInAnonymously(auth)
        .then(() => {
          console.log('Auto login berhasil');
        })
        .catch((error) => {
          console.error('Auto login gagal:', error);
          setAuthLoading(false);
        });
    }
  });

  return () => unsubscribe();
}, []);

  useEffect(() => {
    setLoading(true);

    const mapDoc = (doc) => ({ ...doc.data(), id: doc.id });

    const membersQuery = query(collection(db, 'members'), orderBy('name'));
    const unsubscribeMembers = onSnapshot(membersQuery, (snapshot) => {
      setMembers(snapshot.docs.map(mapDoc));
      setLoading(false);
    });

    const savingsQuery = query(collection(db, 'savings'));
    const unsubscribeSavings = onSnapshot(savingsQuery, (snapshot) => {
      setSavings(snapshot.docs.map(mapDoc));
    });
    
    const loansQuery = query(collection(db, 'loans'));
    const unsubscribeLoans = onSnapshot(loansQuery, (snapshot) => {
      setLoans(snapshot.docs.map(mapDoc));
    });

    const loanPaymentsQuery = query(collection(db, 'loanPayments'));
    const unsubscribeLoanPayments = onSnapshot(loanPaymentsQuery, (snapshot) => {
      setLoanPayments(snapshot.docs.map(mapDoc));
    });

    return () => {
      unsubscribeMembers();
      unsubscribeSavings();
      unsubscribeLoans();
      unsubscribeLoanPayments();
    };
  }, []);

  const handleAddMember = async (newMember, initialSavings, newReceipt) => {
    const batch = writeBatch(db);
    const { id: memberId, ...memberData } = newMember;
    const memberRef = doc(db, "members", memberId);
    batch.set(memberRef, memberData);

    initialSavings.forEach(saving => {
      const { id: savingId, ...savingData } = saving;
      const savingRef = doc(db, "savings", savingId);
      batch.set(savingRef, savingData);
    });

    try {
      await batch.commit();
      setReceipt(newReceipt);
      setView('membersPage');
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Gagal menambahkan anggota baru. Pastikan ID Anggota unik.");
    }
  };

  // Di dalam App.jsx

// ... (fungsi handleAddMember ada di atas sini) ...

const updateMember = useCallback(async (memberId, updatedData) => {
    try {
        const memberRef = doc(db, "members", memberId);
        await updateDoc(memberRef, updatedData);
        
        // Perbarui state secara optimis agar tampilan langsung berubah
        setMembers(prevMembers => 
            prevMembers.map(member => 
                member.id === memberId ? { ...member, ...updatedData } : member
            )
        );
        
        alert("Data anggota berhasil diperbarui!");
    } catch (error) {
        console.error("Error updating member: ", error);
        alert("Gagal memperbarui data anggota.");
    }
}, []);

// ... (fungsi-fungsi lain seperti handleAddSaving) ...

  const handleAddSaving = async (newSaving, newReceipt) => {
     const { id: savingId, ...savingData } = newSaving;
     try {
        await setDoc(doc(db, "savings", savingId), savingData);
        setReceipt(newReceipt);
     } catch(error) {
        console.error("Error adding saving: ", error);
        alert("Gagal menambahkan simpanan.");
     }
  };
  
  const handleAddLoan = async (newLoan) => {
    const { id: loanId, ...loanData } = newLoan;
    try {
      await setDoc(doc(db, "loans", loanId), loanData);
      alert(`Pinjaman untuk ${members.find(m => m.id === newLoan.memberId)?.name} berhasil ditambahkan.`);
      setView('reportsPage');
    } catch(error) {
       console.error("Error adding loan: ", error);
       alert("Gagal menambahkan pinjaman.");
    }
  };

  const handleAddLoanPayment = async (payment) => {
    const relatedLoan = loans.find(l => l.id === payment.loanId);
    if (!relatedLoan) return;

    const member = members.find(m => m.id === relatedLoan.memberId);
    if (member) {
      const paymentReceipt = {
        memberName: member.name,
        date: payment.paymentDate,
        items: [{
          description: `Angsuran Ke-${payment.installmentNumber} (${relatedLoan.loanType})`,
          amount: payment.amountPaid,
        }],
        total: payment.amountPaid,
      };
      setReceipt(paymentReceipt);
    }
    
    try {
        const batch = writeBatch(db);
        const { id: paymentId, ...paymentData } = payment;
        const paymentRef = doc(db, "loanPayments", paymentId);
        batch.set(paymentRef, paymentData);

        const totalPaymentsForLoan = loanPayments.filter(p => p.loanId === payment.loanId).length + 1;
        if (totalPaymentsForLoan >= relatedLoan.term) {
            const loanRef = doc(db, "loans", payment.loanId);
            batch.update(loanRef, { status: LoanStatus.LUNAS });
        }

        await batch.commit();
    } catch(error) {
        console.error("Error adding loan payment: ", error);
        alert("Gagal menyimpan pembayaran angsuran.");
    }
  };

  const handleViewMember = (memberId) => {
    setSelectedMemberId(memberId);
    setView('memberDetail');
  };

  const handleViewLoanDetail = (loanId) => {
    setSelectedLoanId(loanId);
    setView('loanDetail');
  };

  const handleNavigate = (targetView) => {
    if (view === 'memberDetail' || view === 'loanDetail') {
        setSelectedMemberId(null);
        setSelectedLoanId(null);
    }
    setView(targetView);
  }

  const selectedMember = members.find(m => m.id === selectedMemberId);
  const selectedMemberSavings = savings.filter(s => s.memberId === selectedMemberId);
  const selectedMemberLoans = loans.filter(l => l.memberId === selectedMemberId);
  const selectedLoan = loans.find(l => l.id === selectedLoanId);
  const selectedLoanPayments = loanPayments.filter(p => p.loanId === selectedLoanId);

  const renderContent = () => {
    if (loading || authLoading) {
      return (<div className="flex justify-center items-center h-[calc(100vh-68px)]"><div className="text-xl font-semibold text-gray-700">Memuat data dari database...</div></div>);
    }
    switch (view) {
      case 'membersPage': return <MembersPage members={members} onViewMember={handleViewMember} onAddMemberClick={() => setView('addMember')} />;
      case 'addMember': return <AddMemberForm onAddMember={handleAddMember} onCancel={() => setView('membersPage')} members={members} />;
      case 'memberDetail': return selectedMember ? <MemberDetail member={selectedMember} savings={selectedMemberSavings} loans={selectedMemberLoans} onBack={() => { setView('membersPage'); setSelectedMemberId(null); }} onUpdateMember={updateMember} /> : null;
      case 'transactionsPage': return <SavingsPage members={members} savings={savings} onAddSaving={handleAddSaving} />;
      case 'loansPage': return <LoansPage members={members} onAddLoan={handleAddLoan} />;
      case 'reportsPage': return <ReportsPage members={members} savings={savings} loans={loans} onViewLoanDetail={handleViewLoanDetail} />;
      case 'loanDetail': return selectedLoan ? <LoanDetail loan={selectedLoan} member={members.find(m => m.id === selectedLoan.memberId)} payments={selectedLoanPayments} onAddPayment={handleAddLoanPayment} onBack={() => { setView('reportsPage'); setSelectedLoanId(null); }} /> : null;
      case 'dashboard':
      default: return <Dashboard members={members} savings={savings} loans={loans} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header onNavigate={handleNavigate} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      {receipt && <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
};

export default App;