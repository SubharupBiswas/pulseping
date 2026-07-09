"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";

export default function DashboardUserButton() {
    return (
        <UserButton appearance={{} as any}>
            <UserButton.MenuItems>
                <UserButton.Link
                    label="Billing & Usage"
                    labelIcon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    }
                    href="/dashboard/billing"
                />
            </UserButton.MenuItems>
        </UserButton>
    );
}