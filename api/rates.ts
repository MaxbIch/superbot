const SHEET_ID =
    "1KWOuNVMAy3ol_zp7Kiv_dJq7rm_EHVYNm_Ns5hZZyzc";

export default async function handler(
    req: any,
    res: any
) {
    try {
        const response = await fetch(
            `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`
        );

        const text =
            await response.text();

        const json = JSON.parse(
            text.substring(
                47,
                text.length - 2
            )
        );

        const rows =
            json.table.rows;

        const rates: Record<
            string,
            {
                rate: number;
                vip: number;
                minVip: number;
            }
        > = {};

        rows.forEach((row: any) => {
            const currency =
                row.c?.[0]?.v;

            const rate =
                row.c?.[1]?.v;

            const vip =
                row.c?.[2]?.v;

            const minVip =
                row.c?.[3]?.v;

            if (currency) {
                rates[currency] = {
                    rate: Number(rate),
                    vip: Number(vip),
                    minVip: Number(minVip),
                };
            }
        });

        return res.status(200).json(rates);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error:
                "Failed to load rates",
        });
    }
}