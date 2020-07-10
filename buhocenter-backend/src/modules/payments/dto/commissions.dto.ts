export class CommissionDto {
    readonly serviceFee: number;
    readonly processorFee: number;
}

export class CommissionUpdateDto extends CommissionDto {
    id: number;
}
