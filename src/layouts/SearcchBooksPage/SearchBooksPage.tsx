import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../Utils/Pagination";

export const SearchBooksPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHHttpError] = useState(null);
  const [currentpage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [searchUrl, setSearchUrl] = useState("");
  const [categorySelection, setCategorySelection] = useState("All Cateogry");

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl = "http://localhost:8080/api/books";
      let url = `${baseUrl}?pageNumber=${
        currentpage - 1
      }&pageSize=${booksPerPage}`;

      if (searchUrl === "") {
        url = `${baseUrl}?pageNumber=${
          currentpage - 1
        }&pageSize=${booksPerPage}`;
      } else {
        url = baseUrl + searchUrl;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const responseBody = await response.json();
      const responseArray = responseBody.bookList;

      setTotalAmountOfBooks(responseBody.pageDetails.totalBooks);
      setTotalPages(responseBody.pageDetails.totalPages);

      const loadedBooks: BookModel[] = [];

      for (const key in responseArray) {
        loadedBooks.push({
          id: responseArray[key].id,
          title: responseArray[key].title,
          author: responseArray[key].author,
          description: responseArray[key].description,
          copies: responseArray[key].copies,
          copiesAvailable: responseArray[key].copiesAvailable,
          category: responseArray[key].category,
          img: responseArray[key].img,
        });

        setBooks(loadedBooks);
        setIsLoading(false);
      }
    };

    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHHttpError(error.message);
    });

    window.scroll(0, 0);
  }, [currentpage, searchUrl]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const searchHandlerChange = () => {
    if (search === "") {
      setSearchUrl("");
    } else {
      setSearchUrl(
        `/searchByTitle?title=${search}&pageNumber=0&pageSize=${booksPerPage}`
      );
    }
  };

  const categoryField = (value: string) => {
    if (
      value.toLocaleLowerCase() === "fe" ||
      value.toLocaleLowerCase() === "be" ||
      value.toLocaleLowerCase() === "data" ||
      value.toLocaleLowerCase() === "devops"
    ) {
      setCategorySelection(value);
      setSearchUrl(
        `/searchByCategory?pageNumber=0&pageSize=${booksPerPage}&category=${value}`
      );
    } else {
      setCategorySelection("All");
      setSearchUrl(`?pageNumber=0&pageSize=${booksPerPage}`);
    }
  };

  const indexOfLastBook: number = currentpage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  const lastItem =
    currentpage * booksPerPage <= totalAmountOfBooks
      ? currentpage * booksPerPage
      : totalAmountOfBooks;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="container">
        <div>
          <div className="row mt-5">
            <div className="col-6">
              <div className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-labelledby="Search"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="btn btn-outline-success"
                  onClick={() => searchHandlerChange()}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="col-4">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {categorySelection}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li onClick={() => categoryField("All")}>
                    <a className="dropdown-item" href="#">
                      All
                    </a>
                  </li>
                  <li onClick={() => categoryField("FE")}>
                    <a className="dropdown-item" href="#">
                      Front End
                    </a>
                  </li>
                  <li onClick={() => categoryField("BE")}>
                    <a className="dropdown-item" href="#">
                      Back End
                    </a>
                  </li>
                  <li onClick={() => categoryField("DATA")}>
                    <a className="dropdown-item" href="#">
                      Data
                    </a>
                  </li>
                  <li onClick={() => categoryField("DevOps")}>
                    <a className="dropdown-item" href="#">
                      DevOps
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {totalAmountOfBooks > 0 ? (
            <>
              <div className="mt-3">
                <h5>Number of results: ({totalAmountOfBooks})</h5>
              </div>
              <p>
                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks}{" "}
                items:
              </p>
              {books.map((book) => (
                <SearchBook book={book} key={book.id} />
              ))}
            </>
          ) : (
            <div className="m-5">
              <h3>Can't find what you are lookiing for ?</h3>
              <a
                type="button"
                className="btn main-color btn-md px-4 me-md-2 fw-bold text-white"
                href="#"
              >
                Library services
              </a>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentpage}
              totalPages={totalPages}
              paginate={paginate}
            />
          )}
        </div>
      </div>
    </div>
  );
};
