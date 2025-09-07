// frontend/src/components/BookListPage.tsx

import React, { useState, useEffect } from "react";
import apiClient from "../api/axios";
import { Link } from "react-router-dom";
import type { AxiosError } from "axios";
import { useAuth } from "../hooks/useAuth";
import type { ApiError } from "../types";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

interface Book {
	id: string;
	title: string;
	author: string;
	genre: string;
}

export const BookListPage = () => {
	const [search, setSearch] = useState("");
	const [sortAsc, setSortAsc] = useState(true);

	const [currentPage, setCurrentPage] = useState(1);
	const [booksPerPage, setBooksPerPage] = useState(5);
	const { isAuthenticated } = useAuth();
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [filterGenre, setFilterGenre] = useState("");
	const [filterAuthor, setFilterAuthor] = useState("");

	const indexOfLastBook = currentPage * booksPerPage;
	const indexOfFirstBook = indexOfLastBook - booksPerPage;
	const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

	useEffect(() => {
		const fetchBooks = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await apiClient.get("/books", {
					params: {
						page,
						genre: filterGenre || undefined,
						author: filterAuthor || undefined
					}
				});

				// --- DEBUGGING LOGS ---
				console.log("API call successful.");
				console.log("API Response Status:", response.status);
				console.log("API Response Data:", response.data);
				// ---------------------

				setBooks(response.data.books || []);
				setTotalPages(response.data.pagination.totalPages);
			} catch (err) {
				const axiosError = err as AxiosError<ApiError>;
				const errorMessage = axiosError.response?.data?.message || "Failed to fetch books. Check your backend server and network.";
				console.error("API call failed:", errorMessage);
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchBooks();
	}, [page, filterGenre, filterAuthor]);

	const handleDeleteBook = async (bookId: string) => {
		const confirmDelete = window.confirm("Are you sure you want to delete this book?");
		if (!confirmDelete) return;

		try {
			await apiClient.delete(`/books/${bookId}`);
			setBooks(books.filter((book) => book.id !== bookId));
			alert("Book deleted successfully!");
		} catch (err) {
			const axiosError = err as AxiosError<ApiError>;
			alert(axiosError.response?.data?.message || "Failed to delete book.");
		}
	};

	const handleSearchChange = (e: { target: { value: React.SetStateAction<string> } }) => setSearch(e.target.value);

	const filteredBooks = books
		.filter((book) => book.title.toLowerCase().includes(search.toLowerCase()) || book.author.toLowerCase().includes(search.toLowerCase()) || book.genre.toLowerCase().includes(search.toLowerCase()))
		.sort((a, b) => {
			const aTitle = a.title.toLowerCase();
			const bTitle = b.title.toLowerCase();
			return sortAsc ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
		});

	const nextPage = () => {
		if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
	};

	const prevPage = () => {
		if (currentPage > 1) setCurrentPage((prev) => prev - 1);
	};

	return (
		<>
			<h2 className="text-6xl uppercase font-extrabold text-center mb-5 pb-5">all books</h2>
			<div className="space-y-4">
				<div className="flex flex-wrap items-center gap-2">
					<div className="grow">
						<input type="text" placeholder="Search for a book..." value={search} onChange={handleSearchChange} className="border rounded px-3 py-2 w-" />
					</div>
					<div>
						<Menu>
							{({ open }) => (
								<div>
									<MenuButton className="inline-flex items-center gap-2 rounded-md bg-slate-600 p-2.5 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700">
										Sort By
										<ChevronDownIcon className={`size-4 fill-white transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`} />
									</MenuButton>

									<MenuItems transition anchor="bottom end" className="w-52 origin-top-right rounded-xl border border-white/5 bg-gray-600 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0">
										<MenuItem>
											<button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
												{/* <PencilIcon className="size-4 fill-white/30" /> */}
												Edit
												<kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘E</kbd>
											</button>
										</MenuItem>
										<MenuItem>
											<button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
												{/* <Square2StackIcon className="size-4 fill-white/30" /> */}
												Duplicate
												<kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘D</kbd>
											</button>
										</MenuItem>
										<div className="my-1 h-px bg-white/5" />
										<MenuItem>
											<button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
												{/* <ArchiveBoxXMarkIcon className="size-4 fill-white/30" /> */}
												Archive
												<kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘A</kbd>
											</button>
										</MenuItem>
										<MenuItem>
											<button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
												{/* <TrashIcon className="size-4 fill-white/30" /> */}
												Delete
												<kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘D</kbd>
											</button>
										</MenuItem>
									</MenuItems>
								</div>
							)}
						</Menu>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full table-auto border border-gray-300 text-left">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-2 border">Sl. No</th>
								<th className="px-4 py-2 border">Title</th>
								<th className="px-4 py-2 border">Author</th>
								<th className="px-4 py-2 border">Genre</th>
							</tr>
						</thead>
						<tbody>
							{currentBooks.map((book, index) => (
								<tr key={index} className="hover:bg-gray-50">
									<td className="px-4 py-2 border">{indexOfFirstBook + index + 1}</td>
									<td className="px-4 py-2 border">{book.title}</td>
									<td className="px-4 py-2 border">{book.author}</td>
									<td className="px-4 py-2 border">{book.genre}</td>
								</tr>
							))}
							{currentBooks.length === 0 && (
								<tr>
									<td colSpan={4} className="text-center px-4 py-4 text-gray-500">
										No books found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="flex flex-col sm:flex-row items-center justify-between gap-3">
					<div className="flex items-center gap-2">
						<label htmlFor="perPage">Books per page:</label>
						<select
							id="perPage"
							value={booksPerPage}
							onChange={(e) => {
								setBooksPerPage(Number(e.target.value));
								setCurrentPage(1); // Reset to page 1
							}}
							className="border rounded px-2 py-1">
							{[5, 10, 15, 20].map((num) => (
								<option key={num} value={num}>
									{num}
								</option>
							))}
						</select>
					</div>

					<div className="flex items-center gap-2">
						<button onClick={prevPage} disabled={currentPage === 1} className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded disabled:opacity-50">
							Prev
						</button>
						<span>
							Page {currentPage} of {totalPages}
						</span>
						<button onClick={nextPage} disabled={currentPage === totalPages} className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded disabled:opacity-50">
							Next
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
