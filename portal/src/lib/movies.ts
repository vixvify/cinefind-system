export {
  genreLabels,
  browseGenres,
  SELECTION_LIMIT,
  RECOMMENDATION_LIMIT,
  DEFAULT_PAGE_SIZE,
  ANALYSIS_STAGES,
  ANALYSIS_DURATION_MS,
  ANALYSIS_TICK_MS,
} from "../core/constants/movie.constant.ts";

export type { Genre } from "../core/domain/genre.ts";
export type { Movie, RecommendedMovie } from "../core/domain/movie.ts";

export { parseSelection } from "../core/service/selection.service.ts";
export { recommend } from "../core/service/recommendation.service.ts";
