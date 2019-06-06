SELECT
    (concat(a.wono, concat('-', b.wosgno))) as wono,
    a.cuno,
    a.cunm,
    a.eqmfmd,
    a.eqmfsn
FROM
    libr46.wophdrs0 a
    left join libr46.wopsegs0 b on a.wono = b.wono
WHERE
    STNO IN ('65', '66', '67', '68', '69')
    AND a.acti = 'O'
ORDER BY
    wono