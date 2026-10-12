import "server-only";
import { library as mockLibrary } from "./mock-library.repository";
import type { LibraryRepository } from "./library.repository";

// Select the public-data adapter in one place; routes depend on this boundary.
export const library: LibraryRepository = mockLibrary;
export const getCatalogFacets = () => library.getCatalogFacets();
export const getPublicSlugs = () => library.getPublicSlugs();
