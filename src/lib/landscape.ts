import { getPrimaryCategory } from '../data/categories';
import { getGeoLabel, hasRenderableGeo, type GeoPoint, type PostGeo } from './landscape-geo';

export type LandscapePost = {
	title: string;
	slug: string;
	date: Date;
	summary: string;
	categories: string[];
	tags: string[];
	geo?: PostGeo;
};

export type LandscapeFiltersState = {
	query: string;
	category: string | null;
	country: string | null;
	region: string | null;
};

export type RenderableMarker = {
	slug: string;
	title: string;
	date: Date;
	summary: string;
	category: string;
	tags: string[];
	lat: number;
	lng: number;
	pointName: string;
	geoType: 'country' | 'region' | 'multi-country';
};

export function normalizeLandscapePosts(posts: any[]): LandscapePost[] {
	return posts.map((post) => {
		const slug = post.id.replace(/\.(md|mdx)$/i, '');
		const primaryCategory = getPrimaryCategory(post.data.tags).slug;
		return {
			title: post.data.title,
			slug,
			date: post.data.pubDate,
			summary: post.data.description,
			categories: [primaryCategory],
			tags: post.data.tags,
			geo: post.data.geo,
		};
	}).sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

export function applyLandscapeFilters(posts: LandscapePost[], filters: LandscapeFiltersState) {
	const query = filters.query.trim().toLowerCase();
	return posts.filter((post) => {
		if (filters.category && !post.categories.includes(filters.category) && !post.tags.includes(filters.category)) return false;
		if (filters.country && !post.geo?.countries?.includes(filters.country)) return false;
		if (filters.region && post.geo?.region !== filters.region) return false;
		if (!query) return true;
		const haystack = `${post.title} ${post.summary} ${post.tags.join(' ')} ${getGeoLabel(post.geo)}`.toLowerCase();
		return haystack.includes(query);
	});
}

export function getRenderableMarkers(posts: LandscapePost[]): RenderableMarker[] {
	return posts
		.filter((post) => hasRenderableGeo(post.geo))
		.flatMap((post) => (post.geo?.points ?? []).map((point: GeoPoint) => ({
			slug: post.slug,
			title: post.title,
			date: post.date,
			summary: post.summary,
			category: post.categories[0],
			tags: post.tags,
			lat: point.lat,
			lng: point.lng,
			pointName: point.name,
			geoType: post.geo!.type as 'country' | 'region' | 'multi-country',
		})));
}

export { getGeoLabel, hasRenderableGeo };
