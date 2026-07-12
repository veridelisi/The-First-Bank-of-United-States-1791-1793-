/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Coins,
  TrendingUp,
  Building2,
  DollarSign,
  Award,
  FileText,
  CheckCircle2,
  HelpCircle,
  Info,
  Layers,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Scale,
  RefreshCw,
  Clock,
  BookMarked,
  Eye,
  List,
  Sparkles,
  LayoutGrid,
  Keyboard,
  Lightbulb
} from 'lucide-react';

// Define slide structural type
interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  category: 'History' | 'Source' | 'Ledger' | 'Mechanics' | 'Sovereign';
  notes: string;
}

export default function App() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [selectedLedgerItem, setSelectedLedgerItem] = useState<string | null>(null);
  
  // Custom interactive presentation states
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false);
  const [showSlideMap, setShowSlideMap] = useState<boolean>(false);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);

  // Swipe gesture refs for mobile phones
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;  // Swipe Left -> Next
    const isRightSwipe = distance < -50; // Swipe Right -> Prev
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const formatZeroPadded = (num: number) => {
    return num < 10 ? `0${num}` : `${num}`;
  };
  
  // Slide 4 Simulator state
  const [slide4Cash, setSlide4Cash] = useState<number>(320581);
  const [slide4Deposits, setSlide4Deposits] = useState<number>(492262);
  const [slide4Log, setSlide4Log] = useState<string[]>(['Initial state (Dec 26, 1791)']);
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  // Slide 5 Cycle step state
  const [activeCycleStep, setActiveCycleStep] = useState<number>(0);

  // Slide 6 Deposits interactive focus
  const [depositFocus, setDepositFocus] = useState<'government' | 'private' | null>(null);

  // Slide 7 Loan flow step
  const [loanStep, setLoanStep] = useState<number>(0);

  // Auto-play timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const AUTOPLAY_DELAY = 8000; // 8 seconds per slide

  // List of slides content matching the user's presentation perfectly
  const slides: SlideData[] = [
    {
      id: 1,
      title: "A Tribute to James O. Wettereau",
      category: "History",
      notes: "This work is dedicated to James O. Wettereau (1902-1961),\n\nwho,\n\n\"fell in love\" with the First Bank of the United States and resolved to write its history.\n\nHis pioneering archival work reconstructed hundreds of balance sheets of the First Bank and made modern research possible."
    },
    {
      id: 2,
      title: "Primary Source",
      subtitle: "James O. Wettereau",
      category: "Source",
      notes: "Statistical Records of the First Bank of the United States\n\nThis book reconstructs the Bank's weekly balance sheets from original archival records.\n\nThe balance sheets provide a unique opportunity to observe the development of America's first national bank almost week by week."
    },
    {
      id: 3,
      title: "December 26, 1791",
      subtitle: "The First Published Balance Sheet",
      category: "Ledger",
      notes: "Assets\n\nBills Discounted ............ $688,775\nCash on Hand ................. $320,581\n\nLiabilities\n\nCapital Stock ............... $496,550\nDeposits .................... $492,262\nBank Notes ................... $14,270\nPost Notes .................... $3,598\n\nKey Insight\n\nImmediately after opening, nearly 70% of the Bank's assets consisted of discounted bills, indicating that the Bank had already begun creating credit through discounting operations."
    },
    {
      id: 4,
      title: "Deposits Begin to Grow",
      category: "Mechanics",
      notes: "When customers deposited specie (gold and silver),\n\nthe Bank simultaneously\n\n• increased its cash assets\n\nand\n\n• recorded customer deposits as liabilities.\n\nBalance Sheet Effect\n\nAssets\nCash\n=\nLiabilities\nDeposits\n\nEvidence\n\nDecember 26\nCash\n$320,581\n↓\nDecember 29\nCash\n$706,048\nDeposits\n$1,031,125\n\nKey Insight\n\nEvery specie deposit expanded both sides of the balance sheet."
    },
    {
      id: 5,
      title: "Deposits, Notes, and Discounts Expand Together",
      category: "Mechanics",
      notes: "As the Bank began operating, its balance sheet expanded through several connected transactions.\n\nCustomers could bring specie to the Bank and receive a deposit balance:\n• + Cash on Hand\n• + Deposit Money\n\nDepositors could later convert part of their deposits into circulating banknotes:\n• − Deposit Money\n• + Bank Notes in Circulation\n\nThe Bank could also discount a merchant’s bill and provide the proceeds as:\n• a deposit balance,\n• banknotes,\n• post notes,\n• or a combination of these.\n\nPossible Balance-Sheet Movements\n\nSpecie deposited\nCustomer brings gold or silver\n→ Bank cash increases\n→ Customer deposit increases\n\nDeposit converted into notes\nCustomer withdraws banknotes\n→ Deposits decrease\n→ Banknotes in circulation increase\n\nBill discounted\nBank acquires a commercial bill\n→ Bills discounted increase\n→ Deposits, banknotes, or post notes increase"
    },
    {
      id: 6,
      title: "Treasury Deposits Appear",
      category: "Sovereign",
      notes: "March 9, 1792\n\nFor the first time,\n\nthe Bank separately reports\n\nGovernment Deposits\n$599,870\n\nPrivate Deposits\n$569,550\n\nWhy is this important?\n\nThe First Bank now served\n• commercial customers\n\nand\n\n• the United States Treasury.\n\nThe appearance of a separate Government Deposit account reflects the Bank's growing role as the federal government's fiscal agent, particularly in handling customs revenues."
    },
    {
      id: 7,
      title: "The $2 Million Loan to the United States",
      category: "Sovereign",
      notes: "June 29, 1792\n\nA new asset appears.\n\nLoaned U.S.\nNo. 1 & No. 3\n$2,000,000\n\nLoaned U.S.\nNo. 2\n$100,000\n\nWhy is this important?\n\nThis is the first balance-sheet evidence that the Bank had fulfilled\n\nSection 11\n\nof the Bank Charter,\n\nwhich required the Bank to lend\n\n$2 million\n\nto the federal government.\n\nFinancial Relationship\n\nUnited States Treasury\n↓\nSubscribed\n$2 million\nBUS Stock\n↓\nFirst Bank\n↓\nLoan\n$2 million\n↓\nTreasury"
    }
  ];

  // Handle Autoplay slideshow
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, AUTOPLAY_DELAY);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying]);

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        setIsTheaterMode((prev) => !prev);
      } else if (e.key === '?' || e.key === '/') {
        setShowKeyboardHelp((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsPlaying(false);
  };

  const selectSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPlaying(false);
  };

  // Slide 4 Custom Actions
  const handleSimulateDeposit = (amount: number) => {
    if (isDepositing) return;
    setIsDepositing(true);
    setTimeout(() => {
      setSlide4Cash((prev) => prev + amount);
      setSlide4Deposits((prev) => prev + amount);
      setSlide4Log((prev) => [
        `Deposited $${amount.toLocaleString()} in specie. Cash +$${amount.toLocaleString()}, Deposits +$${amount.toLocaleString()}`,
        ...prev
      ]);
      setIsDepositing(false);
    }, 800);
  };

  const resetSlide4 = () => {
    setSlide4Cash(320581);
    setSlide4Deposits(492262);
    setSlide4Log(['Initial state (Dec 26, 1791)']);
  };

  const setHistoricalDec29 = () => {
    setIsDepositing(true);
    setTimeout(() => {
      setSlide4Cash(706048);
      setSlide4Deposits(1031125);
      setSlide4Log([
        'Applied Dec 29, 1791 records. Cash expanded by $385,467, Deposits expanded by $538,863.',
        ...slide4Log
      ]);
      setIsDepositing(false);
    }, 600);
  };

  // Definitions for Slide 3 Items
  const ledgerDefinitions: Record<string, { title: string; desc: string; type: 'Asset' | 'Liability' }> = {
    billsDiscounted: {
      title: "Bills Discounted ($688,775)",
      desc: "Short-term loans made to merchants and businesses. The bank 'discounted' commercial bills of exchange (buying them at slightly less than face value and collecting full payment when they matured in 30-60 days). This was the primary driver of credit in the early republic.",
      type: "Asset"
    },
    cashOnHand: {
      title: "Cash on Hand ($320,581)",
      desc: "Specie (physical gold and silver coins, mostly Spanish milled dollars) held securely inside the bank vaults. This critical reserve backed up the bank's circulating paper notes and customer deposits, ensuring instant redemption upon demand.",
      type: "Asset"
    },
    capitalStock: {
      title: "Capital Stock ($496,550)",
      desc: "The portion of shareholder equity paid into the bank. The bank was chartered with a $10 million authorized capital, paid in structured installments consisting of 1/4 gold and silver specie, and 3/4 interest-bearing federal debt securities.",
      type: "Liability"
    },
    deposits: {
      title: "Deposits ($492,262)",
      desc: "Funds deposited by private merchants, brokers, and individuals for safekeeping and convenient check clearing. Depositors could withdraw these funds as gold coins or exchange them for paper bank notes at the bank's teller windows.",
      type: "Liability"
    },
    bankNotes: {
      title: "Bank Notes ($14,270)",
      desc: "Standard circulating paper currency issued by the First Bank of the United States. These notes were fully legal tender for government payments and could be exchanged for physical gold or silver specie on demand at any bank branch.",
      type: "Liability"
    },
    postNotes: {
      title: "Post Notes ($3,598)",
      desc: "Promissory credit notes issued by the bank that were payable to a specific person at a set future date (usually 30 to 60 days) rather than on demand. They were widely used as a secure, theft-proof method for long-distance business remittances.",
      type: "Liability"
    }
  };

  // Helper categories for styling
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'History': return { bg: 'bg-amber-50 text-brand-gold border-amber-200', dot: 'bg-brand-gold' };
      case 'Source': return { bg: 'bg-stone-100 text-stone-800 border-stone-200', dot: 'bg-stone-600' };
      case 'Ledger': return { bg: 'bg-emerald-50 text-brand-green border-emerald-200', dot: 'bg-brand-green' };
      case 'Mechanics': return { bg: 'bg-[#4A5D4E]/10 text-brand-green border-[#4A5D4E]/20', dot: 'bg-brand-green' };
      case 'Sovereign': return { bg: 'bg-amber-50 text-brand-gold border-amber-200', dot: 'bg-brand-gold' };
      default: return { bg: 'bg-gray-100 text-gray-800 border-gray-200', dot: 'bg-gray-600' };
    }
  };

  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-text font-sans flex flex-col antialiased selection:bg-brand-gold/20 selection:text-brand-gold" id="main_app_container">
      
      {/* Elevated Top Navigation Bar & Unified Control Center */}
      {!isTheaterMode && (
        <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-40 text-editorial-text select-none print:hidden" id="app_header">
          {/* Left: App Identity and Slide Map Modal Button */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-brand-green rounded-sm flex items-center justify-center text-white text-[10px] font-bold shrink-0">BUS</div>
            <button
              onClick={() => setShowSlideMap(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4A5D4E]/10 hover:bg-brand-green/15 text-brand-green rounded-lg transition-all cursor-pointer font-semibold text-xs border border-[#4A5D4E]/20"
              title="Open Slide Map Index"
              id="bar_slide_map_btn"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="font-sans uppercase tracking-wider text-[10px] md:text-xs">Slide Map</span>
            </button>
            <div className="h-4 w-px bg-gray-200"></div>
            <span className="font-serif text-xs md:text-sm font-bold text-gray-600 tabular-nums">
              {formatZeroPadded(currentSlide + 1)} <span className="text-[10px] md:text-xs text-gray-400 font-sans font-normal mx-0.5">/</span> {formatZeroPadded(slides.length)}
            </span>
          </div>

          {/* Center: Presentation Main Title (Hidden on small viewports) */}
          <div className="hidden lg:flex flex-col text-center">
            <span className="text-xs font-bold text-[#1A1C1E] tracking-tight">The First Bank of the United States (1791–1811)</span>
            <span className="text-[10px] text-gray-400 font-serif italic">How the Bank's Balance Sheet Evolved</span>
          </div>

          {/* Right: Interactive Navigation & Settings Controls */}
          <div className="flex items-center gap-2">
            {/* Play/Pause Autoplay ("Present") */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isPlaying 
                  ? 'bg-brand-gold text-white shadow-xs' 
                  : 'bg-brand-green hover:bg-[#3D4D3F] text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Autoplay'}</span>
            </button>

            <div className="h-4 w-px bg-gray-200 hidden xs:block"></div>

            {/* Notes Toggle */}
            <button 
              onClick={() => setShowNotes(!showNotes)} 
              className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                showNotes 
                  ? 'bg-[#4A5D4E]/10 border-[#4A5D4E]/30 text-brand-green' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              id="toggle_notes_btn"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showNotes ? "Hide Notes" : "Show Notes"}</span>
              <span className="sm:hidden">Notes</span>
            </button>

            {/* Export PDF Button */}
            <button
              onClick={() => window.print()}
              className="px-2.5 py-1 text-xs font-semibold rounded-full border border-gray-200 bg-white text-brand-gold hover:bg-amber-50/50 transition-all cursor-pointer flex items-center gap-1.5"
              id="export_pdf_btn"
              title="Print Slides or Export as PDF (Excluding Curator Notes)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>

            {/* Keyboard Guide Toggle */}
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer hover:bg-gray-100 text-gray-500 hover:text-[#1A1C1E] hidden sm:block ${
                showKeyboardHelp ? 'bg-gray-100 text-[#1A1C1E]' : ''
              }`}
              title="Keyboard Shortcuts Guide"
              id="bar_shortcuts_btn"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className="p-1.5 rounded-lg transition-all cursor-pointer hover:bg-gray-100 text-gray-500 hover:text-[#1A1C1E] hidden sm:block"
              title="Theater View"
            >
              {isTheaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <div className="h-4 w-px bg-gray-200"></div>

            {/* Previous/Next Navigation Pill */}
            <div className="flex items-center gap-0.5 bg-white border border-gray-200 shadow-xs rounded-lg p-0.5">
              <button
                onClick={prevSlide}
                className="p-1.5 hover:bg-gray-50 text-gray-700 hover:text-[#1A1C1E] rounded-md transition-colors cursor-pointer flex items-center justify-center"
                title="Previous Slide"
                id="bar_prev_btn"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 hover:bg-gray-50 text-gray-700 hover:text-[#1A1C1E] rounded-md transition-colors cursor-pointer flex items-center justify-center"
                title="Next Slide"
                id="bar_next_btn"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Workspace Frame */}
      <main className="flex-1 flex overflow-hidden print:hidden" id="presentation_workspace">
        <section className="flex-1 p-4 sm:p-6 md:p-12 lg:p-16 flex flex-col relative overflow-y-auto bg-editorial-bg" id="stage_container">
          
          {/* Main Slide Layout Card */}
          <div 
            className="flex-1 flex flex-col justify-between max-w-5xl w-full mx-auto relative min-h-[460px]" 
            id="slide_box_outer"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            
            {/* Top row with slide identifier */}
            <div className="flex justify-between items-start mb-6">
              <div className="max-w-xl">
                <p className="text-[11px] font-bold tracking-[0.2em] text-brand-gold mb-3 uppercase">
                  Fiscal History Analysis • 1791—1793
                </p>
                
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${getCategoryTheme(slides[currentSlide].category).bg}`}>
                  {slides[currentSlide].category}
                </span>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-[1.1] tracking-tight mb-4 text-editorial-text mt-3">
                  {slides[currentSlide].title}
                </h1>
                
                {slides[currentSlide].subtitle && (
                  <p className="text-sm md:text-md leading-relaxed text-gray-500 italic font-serif">
                    {slides[currentSlide].subtitle}
                  </p>
                )}
              </div>
              
              <div className="text-right shrink-0">
                <span className="text-[72px] md:text-[96px] font-serif font-thin text-stone-200/80 block leading-none select-none">
                  0{slides[currentSlide].id}
                </span>
              </div>
            </div>

            {/* Slide Body grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch my-auto py-4" id="slide_content_grid">
              
              {/* Left Column: Authentic presentation text narrative */}
              <div className="lg:col-span-6 flex flex-col justify-center text-sm md:text-base text-gray-700 space-y-4">
                {currentSlide === 0 && (
                  <div className="space-y-4 font-serif">
                    <p className="text-gray-800 leading-relaxed text-base font-semibold">
                      This work is dedicated to James O. Wettereau (1902–1961),
                    </p>
                    <p className="text-gray-600 leading-relaxed text-sm italic pl-4 border-l-2 border-brand-gold">
                      who,
                    </p>
                    <p className="text-lg text-editorial-text font-bold leading-relaxed">
                      "fell in love" with the First Bank of the United States and resolved to write its history.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm font-sans">
                      His pioneering archival work reconstructed hundreds of balance sheets of the First Bank and made modern research possible.
                    </p>
                  </div>
                )}

                {currentSlide === 1 && (
                  <div className="space-y-4 font-serif">
                    <p className="text-brand-gold font-bold tracking-wider uppercase text-xs">Primary Source: James O. Wettereau</p>
                    <h3 className="font-serif text-lg font-bold text-brand-green leading-tight">
                      Statistical Records of the First Bank of the United States
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm font-sans">
                      This book reconstructs the Bank's weekly balance sheets from original archival records.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm font-sans">
                      The balance sheets provide a unique opportunity to observe the development of America's first national bank almost week by week.
                    </p>
                  </div>
                )}

                {currentSlide === 2 && (
                  <div className="space-y-4">
                    <div className="bg-stone-50 p-4 rounded-xl border border-gray-100 space-y-3 font-mono text-xs">
                      <div>
                        <span className="font-serif font-bold text-brand-green block border-b border-gray-200 pb-1 mb-1.5 uppercase tracking-wide">Assets</span>
                        <div className="flex justify-between py-0.5">
                          <span className="text-gray-500">Bills Discounted</span>
                          <span className="font-bold text-[#1A1C1E]">$688,775</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-gray-500">Cash on Hand</span>
                          <span className="font-bold text-[#1A1C1E]">$320,581</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-serif font-bold text-brand-gold block border-b border-gray-200 pb-1 mb-1.5 uppercase tracking-wide">Liabilities</span>
                        <div className="flex justify-between py-0.5">
                          <span className="text-gray-500">Capital Stock</span>
                          <span className="font-bold text-[#1A1C1E]">$496,550</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-gray-500">Deposits</span>
                          <span className="font-bold text-[#1A1C1E]">$492,262</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-gray-500">Bank Notes</span>
                          <span className="font-bold text-[#1A1C1E]">$14,270</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-gray-500">Post Notes</span>
                          <span className="font-bold text-[#1A1C1E]">$3,598</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 border-t border-gray-100 pt-3">
                      <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">Key Insight</span>
                      <p className="text-gray-800 font-serif italic text-sm leading-relaxed pl-3 border-l-2 border-brand-gold">
                        Immediately after opening, nearly 70% of the Bank's assets consisted of discounted bills, 
                      </p>
                      <p className="text-gray-600 text-xs leading-relaxed font-sans">
                        indicating that the Bank had already begun creating credit through discounting operations.
                      </p>
                    </div>
                  </div>
                )}

                {currentSlide === 3 && (
                  <div className="space-y-4 text-xs md:text-sm">
                    <p className="text-gray-700 leading-relaxed font-serif">
                      When customers deposited specie (gold and silver), the Bank simultaneously:
                    </p>
                    <div className="bg-[#F9F9F8] border border-gray-200 rounded-xl p-3.5 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
                        <span className="font-semibold text-gray-800">increased its cash assets</span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono pl-3.5">and</div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                        <span className="font-semibold text-gray-800">recorded customer deposits as liabilities.</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-3 font-mono text-xs">
                      <div>
                        <span className="text-brand-green font-bold block mb-1 text-[10px] uppercase tracking-wider">Assets</span>
                        <span className="text-gray-800 text-sm">Cash</span>
                      </div>
                      <div>
                        <span className="text-brand-gold font-bold block mb-1 text-[10px] uppercase tracking-wider">Liabilities</span>
                        <span className="text-gray-800 text-sm">Deposits</span>
                      </div>
                    </div>

                    <div className="bg-stone-50 border border-gray-200 rounded-xl p-3 space-y-1.5 text-xs font-mono">
                      <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wider mb-1">Evidence:</span>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>December 26: Cash</span>
                        <span>$320,581</span>
                      </div>
                      <div className="text-center text-gray-300">↓</div>
                      <div className="flex justify-between items-center text-gray-800 font-semibold">
                        <span>December 29: Cash</span>
                        <span>$706,048</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-800 font-semibold border-t border-gray-100 pt-1">
                        <span>December 29: Deposits</span>
                        <span>$1,031,125</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">Key Insight</span>
                      <p className="text-gray-800 font-serif italic text-xs md:text-sm pl-3 border-l-2 border-brand-gold">
                        Every specie deposit expanded both sides of the balance sheet.
                      </p>
                    </div>
                  </div>
                )}

                {currentSlide === 4 && (
                  <div className="space-y-4 text-xs md:text-sm">
                    <p className="text-gray-700 font-serif leading-relaxed text-sm md:text-base">
                      As the Bank began operating, its balance sheet expanded through several connected transactions.
                    </p>

                    <div className="space-y-3">
                      {/* Transaction 1 */}
                      <div className="bg-stone-50 border border-gray-200 rounded-xl p-3.5 space-y-1.5">
                        <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider block">Specie Deposit</span>
                        <p className="text-gray-700 leading-normal font-serif text-xs">
                          Customers could bring specie to the Bank and receive a deposit balance:
                        </p>
                        <div className="flex gap-2 font-mono text-[10px]">
                          <span className="px-2 py-1 bg-white border border-gray-150 rounded text-brand-green font-bold">+ Cash on Hand</span>
                          <span className="px-2 py-1 bg-white border border-gray-150 rounded text-brand-gold font-bold">+ Deposit Money</span>
                        </div>
                      </div>

                      {/* Transaction 2 */}
                      <div className="bg-stone-50 border border-gray-200 rounded-xl p-3.5 space-y-1.5">
                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">Currency Conversion</span>
                        <p className="text-gray-700 leading-normal font-serif text-xs">
                          Depositors could later convert part of their deposits into circulating banknotes:
                        </p>
                        <div className="flex gap-2 font-mono text-[10px]">
                          <span className="px-2 py-1 bg-white border border-gray-150 rounded text-red-600 font-bold">− Deposit Money</span>
                          <span className="px-2 py-1 bg-white border border-gray-150 rounded text-brand-green font-bold">+ Bank Notes in Circulation</span>
                        </div>
                      </div>

                      {/* Transaction 3 */}
                      <div className="bg-stone-50 border border-gray-200 rounded-xl p-3.5 space-y-1.5">
                        <span className="text-[10px] font-bold text-[#1A1C1E] uppercase tracking-wider block">Commercial Discounting</span>
                        <p className="text-gray-700 leading-normal font-serif text-xs">
                          The Bank could also discount a merchant’s bill and provide the proceeds as:
                        </p>
                        <div className="grid grid-cols-2 gap-2 font-mono text-[9px] text-center text-gray-700">
                          <span className="p-1.5 bg-white border border-gray-150 rounded">a deposit balance</span>
                          <span className="p-1.5 bg-white border border-gray-150 rounded">banknotes</span>
                          <span className="p-1.5 bg-white border border-gray-150 rounded">post notes</span>
                          <span className="p-1.5 bg-white border border-gray-150 rounded">or a combination of these</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentSlide === 5 && (
                  <div className="space-y-4 text-xs md:text-sm">
                    <p className="text-gray-700 leading-relaxed font-serif">
                      March 9, 1792 — For the first time, the Bank separately reports:
                    </p>

                    <div className="bg-stone-50 p-4 rounded-xl border border-gray-200 font-mono text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-brand-green font-semibold">Government Deposits</span>
                        <span className="font-bold text-gray-900">$599,870</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-gold font-semibold">Private Deposits</span>
                        <span className="font-bold text-gray-900">$569,550</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="font-serif font-bold text-[#1A1C1E] block text-xs md:text-sm">Why is this important?</span>
                      <p className="text-gray-600">The First Bank now served:</p>
                      <div className="bg-white border border-gray-100 rounded-xl p-3.5 space-y-2 text-xs text-gray-700 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-brand-gold rounded-full shrink-0"></span>
                          <span>commercial customers</span>
                        </div>
                        <div className="text-[10px] text-gray-400 pl-3.5 uppercase tracking-wider font-mono">and</div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-brand-green rounded-full shrink-0"></span>
                          <span>the United States Treasury.</span>
                        </div>
                      </div>
                      <p className="text-gray-800 font-serif italic text-xs md:text-sm leading-relaxed pl-3 border-l-2 border-brand-green mt-2">
                        Bank's growing role as the federal government's fiscal agent.
                      </p>
                    </div>
                  </div>
                )}

                {currentSlide === 6 && (
                  <div className="space-y-4 text-xs md:text-sm">
                    <p className="text-gray-700 leading-relaxed font-serif">
                      June 29, 1792 — A new asset appears:
                    </p>

                    <div className="bg-stone-50 p-4 rounded-xl border border-gray-200 font-mono text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span>Loaned U.S. No. 1 & No. 3</span>
                        <span className="font-bold text-gray-900">$2,000,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Loaned U.S. No. 2</span>
                        <span className="font-bold text-gray-900">$100,000</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="font-serif font-bold text-[#1A1C1E] block text-xs md:text-sm">Why is this important?</span>
                      <p className="text-gray-600 leading-relaxed font-sans text-xs">
                        This is the first balance-sheet evidence that the Bank had fulfilled <strong>Section 11</strong> of the Bank Charter, which required the Bank to lend <strong>$2 million</strong> to the federal government.
                      </p>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-3 font-mono text-[10px] text-gray-500">
                      <span className="text-[8px] font-bold text-brand-gold uppercase tracking-wider block mb-1.5 text-center">Financial Relationship</span>
                      <div className="flex flex-col items-center space-y-1 text-center">
                        <span className="font-semibold text-gray-800">United States Treasury</span>
                        <span>↓</span>
                        <span>Subscribed $2 million BUS Stock</span>
                        <span>↓</span>
                        <span>First Bank</span>
                        <span>↓</span>
                        <span>Loan $2 million</span>
                        <span>↓</span>
                        <span>Treasury</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Elegant Editorial Interactive Panels */}
              <div className="lg:col-span-6 flex flex-col justify-center min-h-[280px] bg-[#FDFCFB] border border-gray-200 rounded-lg p-5 shadow-sm relative overflow-hidden" id="interactive_visualization_column">
                
                {/* Visual Slide 1: Tribute to James Wettereau */}
                {currentSlide === 0 && (
                  <div className="flex flex-col items-center justify-center space-y-4 py-4 text-center">
                    <div className="w-16 h-16 bg-[#4A5D4E]/10 border border-[#4A5D4E]/30 rounded-full flex items-center justify-center text-brand-green">
                      <Award className="w-8 h-8" />
                    </div>
                    <div className="border-t border-b border-gray-200 py-3 w-full max-w-xs">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold block">In Memoriam</span>
                      <h3 className="font-serif text-xl font-bold text-editorial-text mt-1">James O. Wettereau</h3>
                      <span className="text-xs text-gray-500 block mt-0.5">1902 — 1961</span>
                    </div>
                    <p className="text-xs font-serif italic text-gray-500 max-w-sm leading-relaxed">
                      He dedicated his lifetime to transcribing scattered treasury drafts and branch sheets, reconstructing the first national bank's history.
                    </p>
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-[9px] font-mono rounded text-gray-600 uppercase tracking-wider">Archival Reconstruction</span>
                      <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-[9px] font-mono rounded text-gray-600 uppercase tracking-wider">NYU Historian</span>
                    </div>
                  </div>
                )}

                {/* Visual Slide 2: Book / Source Cover */}
                {currentSlide === 1 && (
                  <div className="flex flex-col items-center justify-center space-y-4 py-2">
                    <div className="w-40 h-56 bg-brand-green border-4 border-[#3D4D3F] rounded shadow-lg relative flex flex-col justify-between p-4 text-center select-none transform hover:scale-102 transition-transform duration-200">
                      <div className="absolute inset-y-0 left-2 w-0.5 bg-white/10"></div>
                      <div className="border border-white/20 p-2 flex-1 flex flex-col justify-between rounded">
                        <span className="text-[8px] font-mono uppercase tracking-widest text-brand-gold font-bold">MONETARY RECONSTRUCTIONS</span>
                        <div className="space-y-1">
                          <h3 className="font-serif text-xs font-bold text-white leading-tight uppercase tracking-tight">STATISTICAL RECORDS</h3>
                          <p className="text-[9px] font-serif text-gray-100/80">of the First Bank of the United States</p>
                        </div>
                        <div className="w-8 h-px bg-brand-gold mx-auto"></div>
                        <span className="text-[9px] font-serif text-gray-200 italic">James O. Wettereau</span>
                      </div>
                    </div>
                    <div className="text-center max-w-xs">
                      <p className="text-xs font-bold font-serif text-[#1A1C1E]">Weekly Balance Sheets 1791–1811</p>
                      <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                        Compiled from the Treasury vaults and letters, Wettereau recreated the weekly accounting of early America.
                      </p>
                    </div>
                  </div>
                )}

                {/* Visual Slide 3: Interactive Balance Sheet T-Account */}
                {currentSlide === 2 && (
                  <div className="flex flex-col h-full space-y-4">
                    <div className="text-center pb-2 border-b border-gray-200 flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">T-ACCOUNT • DECEMBER 26, 1791</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[#4A5D4E]/10 rounded-full text-brand-green">Ledger #1</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 flex-1 select-none text-xs">
                      {/* ASSETS column */}
                      <div className="bg-[#F9F9F8] p-3 rounded border border-gray-200 flex flex-col justify-between space-y-2">
                        <div>
                          <span className="font-serif font-bold text-brand-green block border-b border-gray-200 pb-1 mb-2">ASSETS</span>
                          <div className="space-y-1.5">
                            <button 
                              onClick={() => setSelectedLedgerItem('billsDiscounted')}
                              className={`w-full text-left p-1 rounded transition-all cursor-pointer flex justify-between items-center ${
                                selectedLedgerItem === 'billsDiscounted' ? 'bg-white border-l-2 border-brand-green font-bold shadow-xs' : 'hover:bg-white'
                              }`}
                            >
                              <span className="truncate pr-1">Bills Discounted</span>
                              <span className="font-mono text-gray-900">$688,775</span>
                            </button>
                            <button 
                              onClick={() => setSelectedLedgerItem('cashOnHand')}
                              className={`w-full text-left p-1 rounded transition-all cursor-pointer flex justify-between items-center ${
                                selectedLedgerItem === 'cashOnHand' ? 'bg-white border-l-2 border-brand-green font-bold shadow-xs' : 'hover:bg-white'
                              }`}
                            >
                              <span>Cash on Hand</span>
                              <span className="font-mono text-gray-900">$320,581</span>
                            </button>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-[#1A1C1E]">
                          <span>Total Assets</span>
                          <span className="font-mono">$1,009,356</span>
                        </div>
                      </div>

                      {/* LIABILITIES column */}
                      <div className="bg-[#FDFCFB] p-3 rounded border border-gray-200 flex flex-col justify-between space-y-2">
                        <div>
                          <span className="font-serif font-bold text-brand-gold block border-b border-gray-200 pb-1 mb-2">LIABILITIES & CAP.</span>
                          <div className="space-y-1.5 max-h-36 overflow-y-auto">
                            <button 
                              onClick={() => setSelectedLedgerItem('capitalStock')}
                              className={`w-full text-left p-1 rounded transition-all cursor-pointer flex justify-between items-center ${
                                selectedLedgerItem === 'capitalStock' ? 'bg-white border-l-2 border-brand-gold font-bold shadow-xs' : 'hover:bg-white'
                              }`}
                            >
                              <span className="truncate pr-1">Capital Stock</span>
                              <span className="font-mono text-gray-900">$496,550</span>
                            </button>
                            <button 
                              onClick={() => setSelectedLedgerItem('deposits')}
                              className={`w-full text-left p-1 rounded transition-all cursor-pointer flex justify-between items-center ${
                                selectedLedgerItem === 'deposits' ? 'bg-white border-l-2 border-brand-gold font-bold shadow-xs' : 'hover:bg-white'
                              }`}
                            >
                              <span>Deposits</span>
                              <span className="font-mono text-gray-900">$492,262</span>
                            </button>
                            <button 
                              onClick={() => setSelectedLedgerItem('bankNotes')}
                              className={`w-full text-left p-1 rounded transition-all cursor-pointer flex justify-between items-center ${
                                selectedLedgerItem === 'bankNotes' ? 'bg-white border-l-2 border-brand-gold font-bold shadow-xs' : 'hover:bg-white'
                              }`}
                            >
                              <span>Bank Notes</span>
                              <span className="font-mono text-gray-900">$14,270</span>
                            </button>
                            <button 
                              onClick={() => setSelectedLedgerItem('postNotes')}
                              className={`w-full text-left p-1 rounded transition-all cursor-pointer flex justify-between items-center ${
                                selectedLedgerItem === 'postNotes' ? 'bg-white border-l-2 border-brand-gold font-bold shadow-xs' : 'hover:bg-white'
                              }`}
                            >
                              <span>Post Notes</span>
                              <span className="font-mono text-gray-900">$3,598</span>
                            </button>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-[#1A1C1E]">
                          <span>Liabilities & Cap</span>
                          <span className="font-mono">$1,006,680</span>
                        </div>
                      </div>
                    </div>

                    {/* Ledger Item Definition Display */}
                    <div className="bg-white p-3 rounded border border-gray-200 text-xs min-h-[72px] flex flex-col justify-center">
                      {selectedLedgerItem ? (
                        <div>
                          <span className="font-bold font-serif text-[#1A1C1E] flex items-center gap-1.5 border-b border-gray-100 pb-0.5 mb-1">
                            <Info className="w-3.5 h-3.5 text-brand-gold" />
                            {ledgerDefinitions[selectedLedgerItem].title}
                          </span>
                          <p className="text-[11px] text-gray-600 leading-normal">
                            {ledgerDefinitions[selectedLedgerItem].desc}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 py-1">
                          <Scale className="w-4 h-4 mx-auto text-brand-green/40 mb-1" />
                          <p className="font-serif italic text-[11px]">Select any ledger line item in the tables above to inspect its definition and historical meaning.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Visual Slide 4: Interactive Specie Vault & Deposits Simulator */}
                {currentSlide === 3 && (
                  <div className="flex flex-col space-y-4 h-full">
                    <div className="text-center pb-2 border-b border-gray-200 flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">SPECIE VAULT & LEDGER SIMULATOR</span>
                      <button 
                        onClick={resetSlide4} 
                        className="p-1 text-gray-400 hover:text-brand-green hover:bg-gray-100 rounded transition-colors cursor-pointer"
                        title="Reset Simulator"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 select-none text-xs">
                      {/* ASSETS Column */}
                      <div className="bg-gray-50 p-3 rounded border border-gray-200 flex flex-col justify-between items-center text-center">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-green">Assets (Cash / Specie)</span>
                        <div className="my-2.5 relative flex items-center justify-center">
                          <Coins className={`w-10 h-10 text-brand-gold transition-transform ${isDepositing ? 'scale-110 rotate-12' : ''}`} />
                          {isDepositing && (
                            <span className="absolute -top-1 bg-brand-green text-white font-bold font-mono text-[8px] px-1 rounded animate-ping">+$</span>
                          )}
                        </div>
                        <span className="text-md font-mono font-bold text-brand-green">
                          ${slide4Cash.toLocaleString()}
                        </span>
                      </div>

                      {/* LIABILITIES Column */}
                      <div className="bg-white p-3 rounded border border-gray-200 flex flex-col justify-between items-center text-center">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-gold">Liabilities (Deposits)</span>
                        <div className="my-2.5 relative flex items-center justify-center">
                          <User className={`w-10 h-10 text-brand-gold/60 transition-transform ${isDepositing ? 'scale-110' : ''}`} />
                          {isDepositing && (
                            <span className="absolute -top-1 bg-brand-gold text-white font-bold font-mono text-[8px] px-1 rounded animate-ping">+$</span>
                          )}
                        </div>
                        <span className="text-md font-mono font-bold text-[#1A1C1E]">
                          ${slide4Deposits.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Simulator Controls */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono font-bold text-gray-400 block uppercase tracking-widest">Simulate Specie Deposits:</span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleSimulateDeposit(50000)}
                          disabled={isDepositing}
                          className="bg-brand-green hover:bg-[#3D4D3F] text-white font-semibold py-1 px-2 text-xs rounded disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          + $50k Gold
                        </button>
                        <button
                          onClick={() => handleSimulateDeposit(100000)}
                          disabled={isDepositing}
                          className="bg-brand-green hover:bg-[#3D4D3F] text-white font-semibold py-1 px-2 text-xs rounded disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          + $100k Specie
                        </button>
                        <button
                          onClick={setHistoricalDec29}
                          disabled={isDepositing || slide4Cash === 706048}
                          className="bg-white hover:bg-gray-50 text-brand-gold border border-brand-gold/40 font-bold py-1 px-2 text-xs rounded disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          Apply Dec 29
                        </button>
                      </div>
                    </div>

                    {/* Historical Double-entry Log */}
                    <div className="bg-white text-gray-700 p-2 rounded font-mono text-[10px] h-16 overflow-y-auto border border-gray-200">
                      <span className="text-[8px] text-brand-gold font-bold tracking-wider block mb-0.5">LEDGER ENTRIES RECORDED:</span>
                      <div className="space-y-1">
                        {slide4Log.map((log, lIdx) => (
                          <div key={lIdx} className="truncate border-b border-gray-50 pb-0.5 text-gray-500">
                            &gt; {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual Slide 5: Possible Balance-Sheet Movements */}
                {currentSlide === 4 && (
                  <div className="flex flex-col space-y-3 h-full justify-between">
                    <div className="text-center pb-2 border-b border-gray-200">
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">POSSIBLE BALANCE-SHEET MOVEMENTS</span>
                    </div>

                    <div className="space-y-2 flex-1 select-none text-xs">
                      {[
                        {
                          id: 0,
                          title: "Specie deposited",
                          summary: "Customer brings gold or silver",
                          effects: [
                            { label: "Bank Cash (Asset)", dir: "increase", change: "+ Cash on Hand" },
                            { label: "Customer Deposit (Liability)", dir: "increase", change: "+ Deposit Money" }
                          ],
                          details: "→ Bank cash increases\n→ Customer deposit increases"
                        },
                        {
                          id: 1,
                          title: "Deposit converted into notes",
                          summary: "Customer withdraws banknotes",
                          effects: [
                            { label: "Customer Deposit (Liability)", dir: "decrease", change: "− Deposit Money" },
                            { label: "Bank Notes in Circulation (Liability)", dir: "increase", change: "+ Bank Notes in Circulation" }
                          ],
                          details: "→ Deposits decrease\n→ Banknotes in circulation increase"
                        },
                        {
                          id: 2,
                          title: "Bill discounted",
                          summary: "Bank acquires a commercial bill",
                          effects: [
                            { label: "Bills Discounted (Asset)", dir: "increase", change: "+ Bills Discounted" },
                            { label: "Deposits or Banknotes (Liability)", dir: "increase", change: "+ Deposits, Banknotes, or Post Notes" }
                          ],
                          details: "→ Bills discounted increase\n→ Deposits, banknotes, or post notes increase"
                        }
                      ].map((mov) => (
                        <button
                          key={mov.id}
                          onClick={() => setActiveCycleStep(mov.id)}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                            activeCycleStep === mov.id
                              ? 'bg-gray-50 border-brand-green ring-1 ring-brand-green/20 shadow-xs'
                              : 'bg-white border-gray-100 hover:bg-gray-50/50'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="font-serif font-bold text-editorial-text text-xs md:text-sm">{mov.title}</span>
                            <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                              activeCycleStep === mov.id ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                              Movement 0{mov.id + 1}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-sans italic">{mov.summary}</span>
                          
                          {activeCycleStep === mov.id && (
                            <div className="mt-2 space-y-2 border-t border-gray-200/60 pt-2 w-full">
                              <div className="grid grid-cols-2 gap-2 font-mono text-[8px] sm:text-[9px]">
                                {mov.effects.map((eff, eIdx) => (
                                  <div key={eIdx} className="bg-white p-1.5 rounded border border-gray-150 flex flex-col items-center text-center">
                                    <span className="text-gray-400 font-sans scale-90">{eff.label}</span>
                                    <span className={`font-bold mt-1 text-[9px] sm:text-[10px] ${eff.dir === 'increase' ? 'text-brand-green' : 'text-red-500'}`}>
                                      {eff.change}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-[10px] text-gray-600 font-mono leading-relaxed whitespace-pre-line pl-3 border-l-2 border-brand-gold bg-stone-50/50 p-1.5 rounded">
                                {mov.details}
                              </p>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="text-center text-[9px] text-gray-400 font-serif italic border-t border-gray-100 pt-1">
                      💡 Click on each balance-sheet movement to view its double-entry accounting effects.
                    </div>
                  </div>
                )}

                {/* Visual Slide 6: Deposits Split Chart */}
                {currentSlide === 5 && (
                  <div className="flex flex-col space-y-4 h-full justify-between">
                    <div className="text-center pb-2 border-b border-gray-200">
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">DEPOSITS RATIOS • MARCH 9, 1792</span>
                    </div>

                    <div className="space-y-3 flex-1 flex flex-col justify-center text-xs">
                      {/* Government row */}
                      <div 
                        onClick={() => setDepositFocus('government')}
                        className={`cursor-pointer transition-all p-2.5 rounded border ${
                          depositFocus === 'government' 
                            ? 'bg-gray-50 border-brand-green ring-1 ring-brand-green/20' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1 text-[11px] font-semibold">
                          <span className="text-brand-green flex items-center gap-1.5 font-serif">
                            <span className="w-2 h-2 bg-brand-green rounded-full"></span>
                            Government Deposits (US Treasury)
                          </span>
                          <span className="font-mono">$599,870 (51.3%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-brand-green h-full rounded-full" style={{ width: '51.3%' }}></div>
                        </div>
                      </div>

                      {/* Private row */}
                      <div 
                        onClick={() => setDepositFocus('private')}
                        className={`cursor-pointer transition-all p-2.5 rounded border ${
                          depositFocus === 'private' 
                            ? 'bg-gray-50 border-brand-gold ring-1 ring-brand-gold/20' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1 text-[11px] font-semibold">
                          <span className="text-brand-gold flex items-center gap-1.5 font-serif">
                            <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
                            Private Deposits (Merchant specie)
                          </span>
                          <span className="font-mono text-gray-700">$569,550 (48.7%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-brand-gold h-full rounded-full" style={{ width: '48.7%' }}></div>
                        </div>
                      </div>

                      {/* Info block */}
                      <div className="bg-white p-2.5 rounded border border-gray-200 text-[11px] min-h-[56px] flex flex-col justify-center">
                        {depositFocus === 'government' ? (
                          <p className="text-gray-600"><strong className="text-brand-green font-serif">Federal Agency:</strong> Treasury secretary Alexander Hamilton transferred public tax drafts here, using the bank's branches to manage coastal payments cleanly.</p>
                        ) : depositFocus === 'private' ? (
                          <p className="text-gray-600"><strong className="text-brand-gold font-serif">Merchant Capital:</strong> Shippers and brokers deposited gold/silver specie, utilizing the accounts as safe transactional ledger balances.</p>
                        ) : (
                          <p className="text-gray-400 italic text-center font-serif text-[10px]">Click either deposit bar category to inspect their distinct historical roles.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual Slide 7: Sovereign Loan Loop Timeline */}
                {currentSlide === 6 && (
                  <div className="flex flex-col space-y-4 h-full justify-between text-xs">
                    <div className="text-center pb-2 border-b border-gray-200">
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">HAMILTON'S CIRCULAR STOCK SYSTEM</span>
                    </div>

                    <div className="space-y-1 select-none">
                      {[
                        { title: "Phase 1: Capital Allocation", desc: "Federal Government is authorized to own $2,000,000 (20%) of the bank's stock." },
                        { title: "Phase 2: The Sovereign Loan", desc: "Treasury pays with bills of exchange drawn on the bank, essentially a loan." },
                        { title: "Phase 3: Circular Credit", desc: "The bank records a $2,000,000 Asset (Loaned US) and registers $2,000,000 Treasury Capital Stock (Liability)." },
                        { title: "Phase 4: Net Balance Sheet Effect", desc: "Government owns 20% of bank, paying back the loan over 10 years using stock dividends!" }
                      ].map((phase, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => setLoanStep(pIdx)}
                          className={`w-full text-left p-2 rounded transition-all cursor-pointer flex gap-2 ${
                            loanStep === pIdx
                              ? 'bg-gray-50 border-l-2 border-brand-green border-y border-r border-gray-200 shadow-xs'
                              : 'bg-transparent border border-transparent hover:bg-gray-50/50'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded flex items-center justify-center font-bold font-mono text-[9px] shrink-0 ${
                            loanStep === pIdx ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {pIdx + 1}
                          </span>
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-[#1A1C1E] font-serif text-[11px]">{phase.title}</h4>
                            {loanStep === pIdx && (
                              <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">
                                {phase.desc}
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="text-center text-[9px] text-gray-400 font-serif italic border-t border-gray-100 pt-1.5">
                      💡 Click phases 1-4 to trace Hamilton's circular investment scheme.
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Slide Footnote Information */}
            <div className="mt-4 border-t border-gray-200 pt-3 flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-[0.1em] font-mono relative z-10">
              <div className="flex gap-4">
                <span>Archive Ref: BUS-1791-00{slides[currentSlide].id}</span>
                <span className="hidden sm:inline">Hamilton Papers Vol. IX</span>
              </div>
              <div className="flex gap-3">
                <span className="text-brand-gold font-bold">Wettereau Reconstruction</span>
                <span className="hidden sm:inline">Proprietary Modeling</span>
              </div>
            </div>

          </div>

          {/* Curator Notes Drawer Block (Now embedded beautifully as an elegant card right on the stage) */}
          {showNotes && (
            <div className="max-w-5xl w-full mx-auto mt-6 bg-[#F9F9F8] border border-gray-200 rounded-xl p-5 shadow-xs relative overflow-hidden" id="presenter_notes_drawer">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <BookOpen className="w-16 h-16 text-brand-green" />
              </div>
              <div className="flex items-center gap-2 mb-2 border-b border-gray-200/60 pb-1.5">
                <BookOpen className="w-4 h-4 text-brand-gold" />
                <span className="font-serif text-xs font-bold uppercase text-brand-green tracking-wider">
                  Curator Narrative Note
                </span>
                <span className="text-[9px] font-mono text-gray-400 ml-auto bg-white border border-gray-200 px-2 py-0.5 rounded">
                  James O. Wettereau Collection
                </span>
              </div>
              <p className="font-serif text-gray-600 text-xs md:text-sm leading-relaxed whitespace-pre-line select-text">
                {slides[currentSlide].notes}
              </p>
            </div>
          )}

        </section>
      </main>



      {/* Slide Map Overlay Sheet (Highly optimized drawer modal for mobile/desktop slide jumps) */}
      {showSlideMap && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-xs flex justify-end md:justify-center items-end md:items-center p-0 md:p-4 animate-fade-in" 
          onClick={() => setShowSlideMap(false)}
        >
          <div 
            className="bg-white w-full md:max-w-xl rounded-t-2xl md:rounded-2xl max-h-[85vh] md:max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#F9F9F8]">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-brand-green" />
                <span className="font-serif font-bold text-editorial-text text-base">Slide Index Map</span>
              </div>
              <button 
                onClick={() => setShowSlideMap(false)}
                className="text-gray-500 hover:text-[#1A1C1E] text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                Close Map
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2.5">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => {
                    selectSlide(idx);
                    setShowSlideMap(false);
                  }}
                  className={`w-full text-left rounded-xl p-3 border transition-all cursor-pointer flex items-center justify-between group ${
                    currentSlide === idx
                      ? 'bg-brand-green/5 border-brand-green ring-1 ring-brand-green/20'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-serif text-sm font-bold ${
                      currentSlide === idx ? 'bg-brand-green text-white' : 'bg-stone-100 text-stone-500'
                    }`}>
                      0{slide.id}
                    </span>
                    <div>
                      <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block">
                        {slide.category}
                      </span>
                      <span className="font-serif font-bold text-editorial-text text-sm leading-tight group-hover:text-brand-green transition-colors">
                        {slide.title}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-mono group-hover:translate-x-1 transition-transform">➔</span>
                </button>
              ))}
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-100 text-center text-xs text-gray-400 font-mono">
              First Bank of the United States • Wettereau Collection
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Helper Modal (Highly polished cheatsheet) */}
      {showKeyboardHelp && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => setShowKeyboardHelp(false)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-brand-gold" />
                <h3 className="font-serif font-bold text-editorial-text text-lg">Keyboard Navigation</h3>
              </div>
              <button 
                onClick={() => setShowKeyboardHelp(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2.5 bg-[#F9F9F8] rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium">Next Slide</span>
                <kbd className="px-2.5 py-1 bg-white border border-gray-300 rounded-lg shadow-xs font-mono text-xs font-bold">➔</kbd>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-[#F9F9F8] rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium">Previous Slide</span>
                <kbd className="px-2.5 py-1 bg-white border border-gray-300 rounded-lg shadow-xs font-mono text-xs font-bold">⬅</kbd>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-[#F9F9F8] rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium">Play/Pause Autoplay</span>
                <kbd className="px-5 py-1 bg-white border border-gray-300 rounded-lg shadow-xs font-mono text-xs font-bold">Spacebar</kbd>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-[#F9F9F8] rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium">Toggle Notes</span>
                <kbd className="px-2.5 py-1 bg-white border border-gray-300 rounded-lg shadow-xs font-mono text-xs font-bold">N Key</kbd>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-[#F9F9F8] rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium">Toggle Theater View</span>
                <kbd className="px-2.5 py-1 bg-white border border-gray-300 rounded-lg shadow-xs font-mono text-xs font-bold">F Key</kbd>
              </div>
            </div>

            <button
              onClick={() => setShowKeyboardHelp(false)}
              className="w-full mt-6 py-2.5 bg-brand-green hover:bg-[#3D4D3F] text-white font-bold rounded-xl transition-colors cursor-pointer text-xs"
            >
              Got it, close guide
            </button>
          </div>
        </div>
      )}

      {/* Hidden container styled exclusively for high-fidelity PDF / Printing */}
      <div className="hidden print:block bg-white text-editorial-text font-serif p-0" id="pdf_print_container">
        
        {/* Cover / Preface Page */}
        <div className="print-page-break p-12 min-h-screen flex flex-col justify-between border-b border-gray-100">
          <div className="border-b-2 border-brand-gold pb-6">
            <span className="text-xs uppercase tracking-widest font-sans font-bold text-brand-gold">Published Portfolio</span>
            <h1 className="text-4xl font-serif font-bold mt-2 text-editorial-text">The First Bank of the United States</h1>
            <p className="text-sm font-sans text-gray-500 mt-1">Historical Balance Sheet Evolution (1791–1793)</p>
          </div>
          <div className="my-auto py-12 space-y-6">
            <p className="text-base text-gray-700 leading-relaxed max-w-2xl font-serif">
              This publication traces the chronological development of early America's central credit institution. 
              Utilizing pioneering weekly balance sheet reconstructions, we observe the transformation of sovereign debt and mercantile reserves in the first two years of the bank's active operation.
            </p>
            <div className="border-t border-gray-200 pt-6 max-w-sm">
              <p className="text-xs font-sans font-bold text-gray-400 uppercase tracking-wider">Historical Source Attribution</p>
              <p className="text-sm font-serif text-editorial-text font-bold mt-1">James O. Wettereau Collection</p>
              <p className="text-xs font-sans text-gray-500">NYU Department of History (1902–1961)</p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-[10px] text-gray-400 font-sans uppercase tracking-wider">
            <span>Fiscal History Series</span>
            <span>Page 1</span>
          </div>
        </div>

        {/* Slide 1: Tribute */}
        <div className="print-page-break p-12 min-h-screen flex flex-col justify-between border-b border-gray-100">
          <div className="flex justify-between items-start border-b border-gray-150 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-widest">Slide 01 • History</span>
              <h2 className="text-3xl font-serif font-bold text-editorial-text mt-1">A Tribute to James O. Wettereau</h2>
            </div>
            <span className="text-sm font-sans text-gray-400 font-bold">Page 2</span>
          </div>
          <div className="my-auto py-8 max-w-2xl mx-auto text-center space-y-6">
            <div className="w-12 h-12 bg-stone-100 border border-stone-200 rounded-full flex items-center justify-center text-brand-green mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <div className="border-y border-gray-200 py-4 w-full max-w-md mx-auto">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold block">In Memoriam</span>
              <h3 className="font-serif text-2xl font-bold text-editorial-text mt-1">James O. Wettereau</h3>
              <span className="text-xs text-gray-500 block mt-0.5">1902 — 1961</span>
            </div>
            <p className="text-sm font-serif italic text-gray-600 leading-relaxed max-w-lg mx-auto">
              "He dedicated his lifetime to transcribing scattered treasury drafts and branch sheets, reconstructing the first national bank's history."
            </p>
            <p className="text-xs font-sans text-gray-500 max-w-md mx-auto">
              His pioneering archival work reconstructed hundreds of balance sheets of the First Bank of the United States and made modern monetary research possible.
            </p>
          </div>
          <div className="border-t border-gray-150 pt-4 flex justify-between items-center text-[9px] text-gray-400 font-sans uppercase tracking-wider">
            <span>First Bank of the United States</span>
            <span>Wettereau Reconstruction Project</span>
          </div>
        </div>

        {/* Slide 2: Source */}
        <div className="print-page-break p-12 min-h-screen flex flex-col justify-between border-b border-gray-100">
          <div className="flex justify-between items-start border-b border-gray-150 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">Slide 02 • Source</span>
              <h2 className="text-3xl font-serif font-bold text-editorial-text mt-1">Primary Source Material</h2>
            </div>
            <span className="text-sm font-sans text-gray-400 font-bold">Page 3</span>
          </div>
          <div className="my-auto py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-3xl mx-auto">
            <div className="md:col-span-4 flex justify-center">
              <div className="w-32 h-44 bg-brand-green border-4 border-[#3D4D3F] rounded shadow-md flex flex-col justify-between p-3 text-center text-white">
                <span className="text-[6px] font-mono uppercase tracking-widest text-brand-gold">MONETARY RECONSTRUCTIONS</span>
                <div className="space-y-0.5">
                  <h4 className="font-serif text-[9px] font-bold uppercase leading-tight">STATISTICAL RECORDS</h4>
                  <p className="text-[7px] text-gray-100 font-serif font-sans">of the First Bank of the US</p>
                </div>
                <span className="text-[7px] font-serif text-gray-200 italic">James O. Wettereau</span>
              </div>
            </div>
            <div className="md:col-span-8 space-y-4">
              <p className="text-brand-gold font-sans font-bold tracking-wider uppercase text-xs">Statistical Records of the First Bank</p>
              <p className="text-gray-700 leading-relaxed text-sm font-serif">
                This comprehensive publication reconstructs the Bank's weekly balance sheets from original archival records and correspondence.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm font-serif">
                The balance sheets provide a unique opportunity to observe the development of America's first national bank almost week by week, offering insight into the early republic's credit architecture.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-150 pt-4 flex justify-between items-center text-[9px] text-gray-400 font-sans uppercase tracking-wider">
            <span>First Bank of the United States</span>
            <span>Wettereau Reconstruction Project</span>
          </div>
        </div>

        {/* Slide 3: Ledger */}
        <div className="print-page-break p-12 min-h-screen flex flex-col justify-between border-b border-gray-100">
          <div className="flex justify-between items-start border-b border-gray-150 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-green uppercase tracking-widest">Slide 03 • Ledger</span>
              <h2 className="text-3xl font-serif font-bold text-editorial-text mt-1">First Published Balance Sheet</h2>
              <p className="text-xs text-gray-400 font-sans uppercase mt-0.5">December 26, 1791</p>
            </div>
            <span className="text-sm font-sans text-gray-400 font-bold">Page 4</span>
          </div>
          
          <div className="my-auto py-6 max-w-3xl mx-auto w-full space-y-6">
            <div className="grid grid-cols-2 gap-6 font-mono text-xs border border-gray-300 rounded-lg overflow-hidden">
              <div className="p-4 bg-stone-50 border-r border-gray-200">
                <h3 className="font-serif font-bold text-brand-green text-sm border-b border-gray-200 pb-2 mb-3 uppercase tracking-wider">Assets</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-sans">Bills Discounted</span>
                    <span className="font-bold text-[#1A1C1E]">$688,775</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-sans">Cash on Hand</span>
                    <span className="font-bold text-[#1A1C1E]">$320,581</span>
                  </div>
                </div>
                <div className="pt-4 mt-6 border-t-2 border-gray-200 flex justify-between font-bold text-[#1A1C1E] text-sm">
                  <span className="font-serif">Total Assets</span>
                  <span>$1,009,356</span>
                </div>
              </div>

              <div className="p-4 bg-white">
                <h3 className="font-serif font-bold text-brand-gold text-sm border-b border-gray-200 pb-2 mb-3 uppercase tracking-wider">Liabilities & Capital</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-sans">Capital Stock</span>
                    <span className="font-bold text-[#1A1C1E]">$496,550</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-sans">Deposits</span>
                    <span className="font-bold text-[#1A1C1E]">$492,262</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-sans">Bank Notes</span>
                    <span className="font-bold text-[#1A1C1E]">$14,270</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-sans">Post Notes</span>
                    <span className="font-bold text-[#1A1C1E]">$3,598</span>
                  </div>
                </div>
                <div className="pt-4 mt-2 border-t-2 border-gray-200 flex justify-between font-bold text-[#1A1C1E] text-sm">
                  <span className="font-serif">Total Liabilities & Cap</span>
                  <span>$1,006,680</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FDFCFB] border-l-4 border-brand-gold p-4 rounded-r-lg shadow-xs">
              <span className="text-[10px] font-sans font-bold text-brand-gold uppercase tracking-wider block">Key Operational Insight</span>
              <p className="text-gray-700 font-serif italic text-sm leading-relaxed mt-1">
                Immediately after opening, nearly 70% of the Bank's assets consisted of discounted bills, indicating that the Bank had already begun actively creating credit through discounting operations.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-150 pt-4 flex justify-between items-center text-[9px] text-gray-400 font-sans uppercase tracking-wider">
            <span>First Bank of the United States</span>
            <span>Wettereau Reconstruction Project</span>
          </div>
        </div>

        {/* Slide 4: Mechanics - Deposits Begin to Grow */}
        <div className="print-page-break p-12 min-h-screen flex flex-col justify-between border-b border-gray-100">
          <div className="flex justify-between items-start border-b border-gray-150 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-green uppercase tracking-widest">Slide 04 • Mechanics</span>
              <h2 className="text-3xl font-serif font-bold text-editorial-text mt-1">Deposits Begin to Grow</h2>
            </div>
            <span className="text-sm font-sans text-gray-400 font-bold">Page 5</span>
          </div>

          <div className="my-auto py-8 max-w-2xl mx-auto space-y-6">
            <p className="text-gray-800 font-serif leading-relaxed text-base">
              When customers deposited specie (gold and silver), the Bank simultaneously:
            </p>
            <div className="bg-stone-50 border border-gray-200 rounded-xl p-4 space-y-2 font-serif text-sm">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                <span>Increased its cash assets (+ Cash on Hand)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                <span>Recorded customer deposits as liabilities (+ Deposits)</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3 font-mono text-xs">
              <span className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-wider block">Chronological Specie Movement (Dec 1791)</span>
              <div className="grid grid-cols-3 gap-2 text-center border-b border-gray-100 pb-2 font-bold font-sans">
                <span>Metric</span>
                <span>December 26</span>
                <span>December 29</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center py-1 border-b border-gray-50">
                <span className="text-left font-sans text-gray-500">Cash (Vault Specie)</span>
                <span>$320,581</span>
                <span className="text-brand-green font-bold">$706,048</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center py-1">
                <span className="text-left font-sans text-gray-500">Deposits (Liabilities)</span>
                <span>$492,262</span>
                <span className="text-brand-gold font-bold">$1,031,125</span>
              </div>
            </div>

            <div className="bg-stone-50 border-l-4 border-brand-green p-4 rounded-r-lg">
              <span className="text-[10px] font-sans font-bold text-brand-green uppercase tracking-wider block">Balance Sheet Expansion Effect</span>
              <p className="text-gray-700 font-serif italic text-sm leading-relaxed mt-1">
                Every specie deposit expanded both sides of the balance sheet. Assets (Cash) = Liabilities (Deposits) grew in parallel.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-150 pt-4 flex justify-between items-center text-[9px] text-gray-400 font-sans uppercase tracking-wider">
            <span>First Bank of the United States</span>
            <span>Wettereau Reconstruction Project</span>
          </div>
        </div>

        {/* Slide 5: Mechanics - Multi-factor expansion */}
        <div className="print-page-break p-12 min-h-screen flex flex-col justify-between border-b border-gray-100">
          <div className="flex justify-between items-start border-b border-gray-150 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-green uppercase tracking-widest">Slide 05 • Mechanics</span>
              <h2 className="text-3xl font-serif font-bold text-editorial-text mt-1">Deposits, Notes, and Discounts Expand Together</h2>
            </div>
            <span className="text-sm font-sans text-gray-400 font-bold">Page 6</span>
          </div>

          <div className="my-auto py-6 max-w-3xl mx-auto space-y-6">
            <p className="text-gray-800 font-serif leading-relaxed text-sm md:text-base">
              As the Bank began operating, its balance sheet expanded through three primarily connected transaction pathways:
            </p>

            <div className="grid grid-cols-3 gap-4 font-serif text-xs">
              <div className="bg-stone-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <span className="text-[10px] font-sans font-bold text-brand-green uppercase tracking-wider block">1. Specie Deposit</span>
                <p className="text-gray-600 leading-normal">Customer brings physical gold or silver specie into the vault.</p>
                <div className="font-mono text-[9px] text-brand-green font-bold bg-white p-1 rounded border border-gray-150 text-center mt-2">
                  + Cash on Hand<br />+ Deposit Money
                </div>
              </div>

              <div className="bg-stone-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <span className="text-[10px] font-sans font-bold text-brand-gold uppercase tracking-wider block">2. Currency Conversion</span>
                <p className="text-gray-600 leading-normal">Depositor converts bank deposit balance into circulating paper notes.</p>
                <div className="font-mono text-[9px] text-brand-gold font-bold bg-white p-1 rounded border border-gray-150 text-center mt-2">
                  − Deposit Money<br />+ Bank Notes in Circ.
                </div>
              </div>

              <div className="bg-stone-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <span className="text-[10px] font-sans font-bold text-editorial-text uppercase tracking-wider block">3. Commercial Discount</span>
                <p className="text-gray-600 leading-normal">Bank acquires commercial bill of exchange and credits merchant's balance.</p>
                <div className="font-mono text-[9px] text-[#1A1C1E] font-bold bg-white p-1 rounded border border-gray-150 text-center mt-2">
                  + Bills Discounted<br />+ Deposits / Banknotes
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-xs space-y-1">
              <span className="text-[10px] font-sans font-bold text-gray-400 block uppercase tracking-wider mb-2">Double-Entry Ledger Architecture:</span>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-600">Specie deposited</span>
                <span className="font-semibold text-brand-green">Cash (+A) / Deposits (+L)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-600">Deposit converted into notes</span>
                <span className="font-semibold text-brand-gold">Deposits (-L) / Bank Notes (+L)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Bill discounted</span>
                <span className="font-semibold text-gray-900">Bills Discounted (+A) / Deposits (+L)</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-150 pt-4 flex justify-between items-center text-[9px] text-gray-400 font-sans uppercase tracking-wider">
            <span>First Bank of the United States</span>
            <span>Wettereau Reconstruction Project</span>
          </div>
        </div>

        {/* Slide 6: Sovereign - Treasury Deposits */}
        <div className="print-page-break p-12 min-h-screen flex flex-col justify-between border-b border-gray-100">
          <div className="flex justify-between items-start border-b border-gray-150 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-widest">Slide 06 • Sovereign</span>
              <h2 className="text-3xl font-serif font-bold text-editorial-text mt-1">Treasury Deposits Appear</h2>
              <p className="text-xs text-gray-400 font-sans uppercase mt-0.5">March 9, 1792</p>
            </div>
            <span className="text-sm font-sans text-gray-400 font-bold">Page 7</span>
          </div>

          <div className="my-auto py-8 max-w-2xl mx-auto space-y-6">
            <p className="text-gray-800 font-serif leading-relaxed text-sm md:text-base">
              On March 9, 1792, for the first time in the bank's accounting history, deposits were split and reported separately:
            </p>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs border border-gray-200 rounded-lg p-4 bg-stone-50">
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-bold text-brand-green uppercase tracking-wider block">Government Deposits</span>
                <span className="text-lg font-bold text-[#1A1C1E]">$599,870</span>
                <span className="text-gray-400 block font-sans text-[10px]">(51.3% of total)</span>
              </div>
              <div className="space-y-1 border-l border-gray-200 pl-4">
                <span className="text-[10px] font-sans font-bold text-brand-gold uppercase tracking-wider block">Private Deposits</span>
                <span className="text-lg font-bold text-[#1A1C1E]">$569,550</span>
                <span className="text-gray-400 block font-sans text-[10px]">(48.7% of total)</span>
              </div>
            </div>

            <div className="space-y-3 font-serif text-sm">
              <h3 className="font-bold text-[#1A1C1E] text-base">Key Sovereignty Milestone</h3>
              <p className="text-gray-700 leading-relaxed font-sans text-xs">
                The separate appearance of Government Deposits marks the beginning of the First Bank's official role as the federal government's fiscal agent, facilitating the transfer of customs revenue and public tax drafts across the coastal republic.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-150 pt-4 flex justify-between items-center text-[9px] text-gray-400 font-sans uppercase tracking-wider">
            <span>First Bank of the United States</span>
            <span>Wettereau Reconstruction Project</span>
          </div>
        </div>

        {/* Slide 7: Sovereign - The $2 Million Loan */}
        <div className="print-page-break p-12 min-h-screen flex flex-col justify-between border-b border-gray-100">
          <div className="flex justify-between items-start border-b border-gray-150 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-widest">Slide 07 • Sovereign</span>
              <h2 className="text-3xl font-serif font-bold text-editorial-text mt-1">The $2 Million Loan to the United States</h2>
              <p className="text-xs text-gray-400 font-sans uppercase mt-0.5">June 29, 1792</p>
            </div>
            <span className="text-sm font-sans text-gray-400 font-bold">Page 8</span>
          </div>

          <div className="my-auto py-8 max-w-2xl mx-auto space-y-6">
            <p className="text-gray-800 font-serif leading-relaxed text-sm md:text-base">
              A major credit expansion occurs on June 29, 1792, as the federal government completes its structural stock purchase:
            </p>

            <div className="bg-stone-50 border border-gray-200 rounded-lg p-4 font-mono text-xs space-y-2">
              <span className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-wider block">Recorded Asset on Balance Sheet:</span>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Loaned U.S. No. 1 & No. 3</span>
                <span className="font-bold text-gray-900">$2,000,000</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Loaned U.S. No. 2</span>
                <span className="font-bold text-gray-900">$100,000</span>
              </div>
            </div>

            <div className="space-y-2 font-serif text-sm">
              <span className="font-bold text-[#1A1C1E] text-base">Section 11 Charter Fulfillment</span>
              <p className="text-gray-700 leading-relaxed font-sans text-xs">
                This transaction represents the fulfillment of Section 11 of the Bank Charter. Alexander Hamilton utilized a circular credit scheme: the Treasury subscribed to $2 million of BUS stock, and the bank simultaneously loaned $2 million back to the Treasury to pay for that stock. The loan was repaid over 10 years using the stock's dividends.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-150 pt-4 flex justify-between items-center text-[9px] text-gray-400 font-sans uppercase tracking-wider">
            <span>First Bank of the United States</span>
            <span>Wettereau Reconstruction Project</span>
          </div>
        </div>

      </div>
    </div>
  );
}
