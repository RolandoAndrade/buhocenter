export class AddressVerificationDto {
    firstStreet: string;
    secondStreet: string;
    cityName: string;
    state: string;
    zipcode: number;
    user: {
        id: number;
    };
    status: {
        id: number;
    };
    default: boolean;
}

export class AddressVerificationSO {
    candidates: number;
    match: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zipcode: string;
}

export class AddressVerificationRO {
    input_index: number;
    candidate_index: number;
    delivery_line_1: string;
    last_line: string;
    delivery_point_barcode: number;

    components: {
        primary_number: number;
        street_name: string;
        street_suffix: string;
        city_name: string;
        default_city_name: string;
        state_abbreviation: string;
        zipcode: number;
        plus4_code: number;
        delivery_point: number;
        delivery_point_check_digit: number;
    };

    metadata: {
        record_type: string;
        zip_type: string;
        county_fips: string;
        county_name: string;
        carrier_route: string;
        congressional_district: string;
        rdi: string;
        elot_sequence: string;
        elot_sort: string;
        latitude: string;
        longitude: string;
        precision: string;
        time_zone: string;
        utc_offset: string;
        dst: boolean;
    };

    analysis: {
        dpv_footnotes: string;
        footnotes: string;
        dpv_match_code: string;
        dpv_cmra: string;
        dpv_vacant: string;
        active: string;
    };
}
export class AddressUDDto {
    id: number;
    user: {
        id: number;
    };
}

export class UsersAddress {
    user: {
        id: number;
    };
}
