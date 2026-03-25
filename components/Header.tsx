import { signOut } from "@/auth";
import ThemeBtn from "./ThemeBtn"; // Import tombol baru

export default function Header({ user }: { user: any }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-gray-400 md:hidden cursor-pointer">☰</span>
        <h2 className="font-semibold text-gray-700 hidden md:block">
          Dashboard Si-Dugi
        </h2>
        
        {/* Tombol Switcher ditaruh di sini bro */}
        <div className="ml-2">
          <ThemeBtn />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 border-r pr-6 border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              {user?.role || "USER"}
            </p>
            <p className="text-sm font-bold text-gray-800">
              {user?.name || "User"}
            </p>
          </div>
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {user?.name?.charAt(0) || "U"}
          </div>
        </div>

        <form 
          action={async () => { 
            "use server"; 
            await signOut({ redirectTo: "/login" }); 
          }}
        >
          <button 
            type="submit"
            className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors group"
          >
            <span>Logout</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
          </button>
        </form>
      </div>
    </header>
  );
}