import { SignUpButton, useAuth, UserButton } from "@clerk/clerk-react";
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from "@headlessui/react";
import {
    ChartPie,
    ChevronDown,
    CirclePlay,
    Fingerprint,
    Menu,
    Moon,
    MousePointerClick,
    Phone,
    RefreshCw,
    Sun,
    Grid2x2Plus,
    X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";

const products = [
    {
        name: "Analytics",
        description: "Get a better understanding of your traffic",
        href: "#",
        icon: ChartPie,
    },
    {
        name: "Engagement",
        description: "Speak directly to your customers",
        href: "#",
        icon: MousePointerClick,
    },
    {
        name: "Security",
        description: "Your customers’ data will be safe and secure",
        href: "#",
        icon: Fingerprint,
    },
    {
        name: "Integrations",
        description: "Connect with third-party tools",
        href: "#",
        icon: Grid2x2Plus,
    },
    {
        name: "Automations",
        description: "Build strategic funnels that will convert",
        href: "#",
        icon: RefreshCw,
    },
];
const callsToAction = [
    { name: "Watch demo", href: "#", icon: CirclePlay },
    { name: "Contact sales", href: "#", icon: Phone },
];

export default function Example() {
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigate = useNavigate();
    const { isSignedIn } = useAuth();

    return (
        <header className="">
            <nav className="mx-auto flex max-w-7xl items-center justify-between py-4 px-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="#" className="">
                        <img
                            alt=""
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                            className="h-8 w-auto"
                        />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 border-none">
                        <span className="sr-only">Open main menu</span>
                        <Menu aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    <Popover className="relative">
                        <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold outline-none cursor-pointer">
                            Product
                            <ChevronDown
                                aria-hidden="true"
                                className="size-5 flex-none text-light-secondary-text dark:text-dark-secondary-text"
                            />
                        </PopoverButton>

                        <PopoverPanel
                            transition
                            className="absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-light-surface dark:bg-dark-surface shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                            <div className="p-4">
                                {products.map((item) => (
                                    <div
                                        key={item.name}
                                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-100 dark:hover:bg-dark-bg">
                                        <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-bg group-hover:bg-white dark:group-hover:bg-dark-surface">
                                            <item.icon
                                                aria-hidden="true"
                                                className="size-6 text-light-secondary-text group-hover:text-light-primary dark:group-hover:text-dark-primary"
                                            />
                                        </div>
                                        <div className="flex-auto">
                                            <a
                                                href={item.href}
                                                className="block font-semibold border-none">
                                                {item.name}
                                                <span className="absolute inset-0" />
                                            </a>
                                            <p className="mt-1 text-light-secondary-text dark:text-dark-secondary-text">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 divide-x">
                                {callsToAction.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold border-none hover:bg-gray-100 dark:hover:bg-dark-bg">
                                        <item.icon
                                            aria-hidden="true"
                                            className="size-5 flex-none text-light-secondary-text dark:text-dark-secondary-text"
                                        />
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </PopoverPanel>
                    </Popover>

                    <a href="#" className="text-sm/6 font-semibold">
                        Features
                    </a>
                    <a href="#" className="text-sm/6 font-semibold">
                        Marketplace
                    </a>
                    <a href="#" className="text-sm/6 font-semibold">
                        Company
                    </a>
                </PopoverGroup>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-8 items-center">
                    {theme ? (
                        <Sun
                            onClick={() => setTheme(!theme)}
                            className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text"
                        />
                    ) : (
                        <Moon
                            onClick={() => setTheme(!theme)}
                            className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text"
                        />
                    )}

                    {isSignedIn ? (
                        <div className="flex gap-3 items-center">
                            <button
                                className="text-sm/6 font-semibold"
                                onClick={() => navigate("/dashboard")}>
                                Dashboard
                            </button>
                            <UserButton />
                        </div>
                    ) : (
                        <div className="flex gap-8">
                            <SignUpButton
                                className="inline-block rounded-lg px-3 py-2.5 text-sm/6 font-semibold dark:text-light-primary-text text-dark-primary-text bg-light-primary dark:bg-dark-primary hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover focus-visible:outline-offset-2 focus-visible:outline-light-primary"
                                mode="modal"
                                navigate="/sign-up">
                                Login
                            </SignUpButton>
                        </div>
                    )}
                </div>
            </nav>
            <Dialog
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
                className="lg:hidden">
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-light-bg dark:bg-dark-bg px-6 py-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                alt=""
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                className="h-8 w-auto"
                            />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-light-secondary-text dark:text-dark-secondary-text">
                            <span className="sr-only">Close menu</span>
                            <X aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y dark:divide-dark-secondary-text/40 divide-light-secondary-text/40">
                            <div className="space-y-2 py-6">
                                <Disclosure as="div" className="-mx-3">
                                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold hover:bg-light-surface dark:hover:bg-dark-surface text-light-primary-text dark:text-dark-primary-text">
                                        Product
                                        <ChevronDown
                                            aria-hidden="true"
                                            className="size-5 flex-none group-data-open:rotate-180"
                                        />
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-2 space-y-2">
                                        {[...products, ...callsToAction].map(
                                            (item) => (
                                                <DisclosureButton
                                                    key={item.name}
                                                    as="a"
                                                    href={item.href}
                                                    className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 text-light-primary-text dark:text-dark-primary-text font-semibold hover:bg-light-surface dark:hover:bg-dark-surface">
                                                    {item.name}
                                                </DisclosureButton>
                                            )
                                        )}
                                    </DisclosurePanel>
                                </Disclosure>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface">
                                    Features
                                </a>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface">
                                    Marketplace
                                </a>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface">
                                    Company
                                </a>
                            </div>
                            <div className="py-4">
                                {isSignedIn ? (
                                    <div className="flex gap-3 items-center flex-column">
                                        <UserButton />
                                        <button
                                            onClick={() =>
                                                navigate("/dashboard")
                                            }
                                            className="text-sm/6 font-semibold text-light-primary-text dark:text-dark-primary-text">
                                            Dashboard
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-8">
                                        <SignUpButton
                                            className="inline-block rounded-lg px-3 py-2.5 text-sm/6 font-semibold dark:text-light-primary-text text-dark-primary-text bg-light-primary dark:bg-dark-primary hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover focus-visible:outline-offset-2 focus-visible:outline-light-primary"
                                            mode="modal"
                                            navigate="/sign-up">
                                            Login
                                        </SignUpButton>
                                    </div>
                                )}
                            </div>
                            <div className="py-4 flex">
                                {theme ? (
                                    <div
                                        className="flex items-center gap-3"
                                        onClick={() => setTheme(!theme)}>
                                        <p className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface">
                                            Light Mode
                                        </p>
                                        <Sun className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text" />
                                    </div>
                                ) : (
                                    <div
                                        className="flex items-center gap-3"
                                        onClick={() => setTheme(!theme)}>
                                        <p className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface">
                                            Dark Mode
                                        </p>
                                        <Moon className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
}
