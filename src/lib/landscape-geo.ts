export type GeoPoint = {
	name: string;
	lat: number;
	lng: number;
};

export type GeoType = 'country' | 'region' | 'multi-country' | 'global';

export type PostGeo = {
	type: GeoType;
	countries?: string[];
	region?: string;
	points?: GeoPoint[];
};

export const REGION_POINTS: Record<string, GeoPoint> = {
	EU: { name: 'Europe', lat: 50, lng: 10 },
	UK: { name: 'United Kingdom', lat: 54.5, lng: -2.5 },
	US: { name: 'United States', lat: 39.8, lng: -98.5 },
	APAC: { name: 'Asia-Pacific', lat: 10, lng: 125 },
	GLOBAL: { name: 'Global', lat: 0, lng: 0 },
};

export function isValidPoint(point: GeoPoint) {
	return Number.isFinite(point.lat)
		&& Number.isFinite(point.lng)
		&& point.lat >= -90
		&& point.lat <= 90
		&& point.lng >= -180
		&& point.lng <= 180;
}

export function getRegionPoint(region?: string) {
	if (!region) return undefined;
	return REGION_POINTS[region];
}

export function hasRenderableGeo(geo?: PostGeo) {
	if (!geo || geo.type === 'global') return false;
	return Array.isArray(geo.points) && geo.points.some(isValidPoint);
}

export function getGeoLabel(geo?: PostGeo) {
	if (!geo) return 'Unmapped';
	if (geo.type === 'global') return 'Global';
	if (geo.type === 'region') return geo.region ?? 'Region';
	if (geo.points?.length) return geo.points.map((point) => point.name).join(', ');
	if (geo.countries?.length) return geo.countries.join(', ');
	return 'Mapped';
}
