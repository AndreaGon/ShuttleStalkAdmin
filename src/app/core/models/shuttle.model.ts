export interface Shuttle{
    id?: string,
    plateNo: string,
    routeName: string,
    shuttleImage?: string,
    driver: string[],
    pickupTime: string[],
    dropoffTime: string[],
    route: string[]
}