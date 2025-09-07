import { useEffect, useState } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

const baseNavigation = [
	{ name: "Home", href: "/" },
	{ name: "Books", href: "/books" },
	{ name: "Reviews", href: "/reviews" },
	{ name: "About", href: "/aboutus" },
];

const classNames = (...classes: string[]): string => {
	return classes.filter(Boolean).join(" ");
};

export const Navbar = () => {
	const location = useLocation();
  const [ navigation, setNavigation ] = useState(baseNavigation);
  const [ userLoggedIn, setUserLoggedIn ] = useState(false);

	useEffect(() => {
		const updated = baseNavigation.map((item) => ({
			...item,
			current: item.href === location.pathname
		}));
		setNavigation(updated);
	}, [location.pathname]);

	return (
		<header>
			<Disclosure as="nav" className="relative bg-gray-800 dark:bg-light dark:after:pointer-events-none dark:after:absolute dark:after:inset-x-0 dark:after:bottom-0 dark:after:h-px dark:after:bg-white/10">
				<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
					<div className="relative flex h-16 items-center justify-between">
						<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
							{/* Mobile menu button*/}
							<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
								<span className="absolute -inset-0.5" />
								<span className="sr-only">Open main menu</span>
								<Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
								<XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
							</DisclosureButton>
						</div>
						<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
							<div className="flex shrink-0 items-center">
								{/* Logo on Big Screen */}
								<img alt="Project Logo" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" className="h-8 w-auto" />
								{/* Logo on Big Screen */}
							</div>
							<div className="hidden sm:ml-6 sm:block">
								<div className="flex space-x-4">
									{navigation.map((item) => {
										const isCurrent = item.href === location.pathname;
										return (
											<Link discover="none" key={item.name} to={item.href} aria-current={isCurrent ? "page" : undefined} className={classNames(isCurrent ? "bg-gray-900 text-white dark:bg-gray-950/50" : "text-gray-300 hover:bg-white/5 hover:text-white", "rounded-md px-3 py-2 text-sm font-medium")}>
												{item.name}
											</Link>
										);
									})}
								</div>
							</div>
						</div>
						<>
							{userLoggedIn ? (
								<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
									<button type="button" className="relative rounded-full p-1 text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 dark:hover:text-white">
										<span className="absolute -inset-1.5" />
										<span className="sr-only">View notifications</span>
										<BellIcon aria-hidden="true" className="size-6" />
									</button>

									<Menu as="div" className="relative ml-3">
										<MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
											<span className="absolute -inset-1.5" />
											<span className="sr-only">Open user menu</span>
											<img alt="" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10" />
										</MenuButton>

										<MenuItems transition className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
											<MenuItem>
												<a href="#" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5">
													Your profile
												</a>
											</MenuItem>
											<MenuItem>
												<a href="#" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5">
													Settings
												</a>
											</MenuItem>
											<MenuItem>
												<a href="#" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5">
													Sign out
												</a>
											</MenuItem>
										</MenuItems>
									</Menu>
								</div>
							) : (
								<div className="absolute inset-y-0 right-0 flex items-center pr-2 hidden sm:flex sm:static sm:inset-auto sm:ml-6 sm:pr-0">
									<Link to="/signup" className={`${location.pathname === "signup" ? "bg-gray-900 text-white dark:bg-gray-950/50" : "bg-rose-900/75 text-gray-300 hover:bg-rose-600 hover:text-white duration-300 ease-in-out"} rounded-md px-3 py-2 text-sm font-medium flex gap-2 mr-2`}>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
											<path d="M10 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM16.25 5.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z" />
										</svg>
										Sign Up
									</Link>
									<Link to="/signup" className={`${location.pathname === "signup" ? "bg-gray-900 text-white dark:bg-gray-950/50" : "bg-green-900/75 text-gray-300 hover:bg-green-600 hover:text-white duration-300 ease-in-out"} rounded-md px-3 py-2 text-sm font-medium flex gap-2`}>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
											<path d="M10 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM16.25 5.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z" />
										</svg>
										Log In
									</Link>
								</div>
							)}
						</>
					</div>
				</div>

				<DisclosurePanel className="sm:hidden">
					<div className="space-y-1 px-2 pt-2 pb-3">
						{navigation.map((item) => {
							const isCurrent = item.href === location.pathname;
							return (
								<DisclosureButton key={item.name} as={Link as any} to={item.href} aria-current={isCurrent ? "page" : undefined} className={`text-center ${classNames(isCurrent ? "bg-gray-900 text-white dark:bg-gray-950/50" : "text-gray-300 hover:bg-white/5 hover:text-white", "block rounded-md px-3 py-2 text-base font-medium")}`}>
									{item.name}
								</DisclosureButton>
							);
						})}
					</div>
					<div className="mt-2 px-2 pb-2">
						<Link to="/signup" className={`${location.pathname === "signup" ? "bg-gray-900 text-white dark:bg-gray-950/50" : "bg-rose-900/75 text-gray-300 hover:bg-rose-600 hover:text-white duration-300 ease-in-out"} rounded-md px-3 py-2 text-sm font-medium flex gap-2 mr-0 justify-center mb-2`}>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
								<path d="M10 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM16.25 5.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z" />
							</svg>
							Sign Up
						</Link>
						<Link to="/signup" className={`${location.pathname === "signup" ? "bg-gray-900 text-white dark:bg-gray-950/50" : "bg-green-900/75 text-gray-300 hover:bg-green-600 hover:text-white duration-300 ease-in-out"} rounded-md px-3 py-2 text-sm font-medium flex justify-center gap-2 pb-2`}>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
								<path d="M10 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM16.25 5.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z" />
							</svg>
							Log In
						</Link>
					</div>
				</DisclosurePanel>
			</Disclosure>
		</header>
	);
};
