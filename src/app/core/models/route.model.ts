export interface Route{
    id?: string,
    plateNo: string,
    routeName: string,
    shuttleImage?: string,
    driver: string[],
    seats: number,
    pickupTime: string[],
    dropoffTime: string[],
    route: string[]
}