import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { createPageUrl } from "../utils/utils";
import { Map, Building2 } from "lucide-react";

export default function Layout({ children, currentPageName }) {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50">
            {/* Navigation Bar */}
            <nav className="bg-white/80 backdrop-blur-md border-b-2 border-amber-200 sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="text-3xl">🏴‍☠️</div>
                            <h1 className="text-2xl font-bold text-amber-900">Treasure Hunt</h1>
                        </div>

                        <div className="flex gap-2">
                            <Link to={createPageUrl("beach")}>
                                <button
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${location.pathname === createPageUrl("beach")
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                                            : "bg-white/60 text-amber-900 hover:bg-amber-50 border-2 border-amber-200"
                                        }`}
                                >
                                    <Map className="w-5 h-5" />
                                    Beach Hunt
                                </button>
                            </Link>

                            <Link to={createPageUrl("museum")}>
                                <button
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${location.pathname === createPageUrl("museum")
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                                            : "bg-white/60 text-amber-900 hover:bg-amber-50 border-2 border-amber-200"
                                        }`}
                                >
                                    <Building2 className="w-5 h-5" />
                                    Museum
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main>
                <Outlet />
            </main>
        </div>
    );
}