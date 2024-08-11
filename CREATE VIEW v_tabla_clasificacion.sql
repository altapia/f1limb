CREATE VIEW v_tabla_clasificacion 
AS 
 select u.id, u.nombre, 
 c1.puntos as GP1, 
 c2.puntos as GP2, 
 c3.puntos as GP3, 
 c4.puntos as GP4, 
 c5.puntos as GP5, 
 c6.puntos as GP6, 
 c7.puntos as GP7, 
 c8.puntos as GP8, 
 c9.puntos as GP9, 
 c10.puntos as GP10, 
 c11.puntos as GP11,
 c12.puntos as GP12,
 c13.puntos as GP13,
 c14.puntos as GP14,
 c15.puntos as GP15,
 c16.puntos as GP16,
 c17.puntos as GP17,
 c18.puntos as GP18,
 c19.puntos as GP19,
 c20.puntos as GP20,
 c21.puntos as GP21,
 c22.puntos as GP22,
 c23.puntos as GP23,
 c24.puntos as GP24,
 (IFNULL(c1.puntos,0) +  IFNULL(c2.puntos, 0) +  IFNULL(c3.puntos, 0) +  IFNULL(c4.puntos, 0) +  IFNULL(c5.puntos, 0) +  IFNULL(c6.puntos, 0) +  IFNULL(c7.puntos, 0) +  IFNULL(c8.puntos, 0) +  IFNULL(c9.puntos, 0) +  IFNULL(c10.puntos, 0) +  IFNULL(c11.puntos, 0) +  IFNULL(c12.puntos, 0) +  IFNULL(c13.puntos, 0) +  IFNULL(c14.puntos, 0) +  IFNULL(c15.puntos, 0) +  IFNULL(c16.puntos, 0) +  IFNULL(c17.puntos, 0) +  IFNULL(c18.puntos, 0) +  IFNULL(c19.puntos, 0) +  IFNULL(c20.puntos, 0) +  IFNULL(c21.puntos, 0) +  IFNULL(c22.puntos, 0) +  IFNULL(c23.puntos, 0) +  IFNULL(c24.puntos, 0)) as total
 from user u 
 left join clasificacion c1 on c1.userId = u.id and c1.gpid=1 
 left join clasificacion c2 on c2.userId = u.id and c2.gpid=2 
 left join clasificacion c3 on c3.userId = u.id and c3.gpid=3 
 left join clasificacion c4 on c4.userId = u.id and c4.gpid=4 
 left join clasificacion c5 on c5.userId = u.id and c5.gpid=5 
 left join clasificacion c6 on c6.userId = u.id and c6.gpid=6 
 left join clasificacion c7 on c7.userId = u.id and c7.gpid=7 
 left join clasificacion c8 on c8.userId = u.id and c8.gpid=8 
 left join clasificacion c9 on c9.userId = u.id and c9.gpid=9 
 left join clasificacion c10 on c10.userId = u.id and c10.gpid=10 
 left join clasificacion c11 on c11.userId = u.id and c11.gpid=11 
 left join clasificacion c12 on c12.userId = u.id and c12.gpid=12 
 left join clasificacion c13 on c13.userId = u.id and c13.gpid=13 
 left join clasificacion c14 on c14.userId = u.id and c14.gpid=14 
 left join clasificacion c15 on c15.userId = u.id and c15.gpid=15 
 left join clasificacion c16 on c16.userId = u.id and c16.gpid=16 
 left join clasificacion c17 on c17.userId = u.id and c17.gpid=17 
 left join clasificacion c18 on c18.userId = u.id and c18.gpid=18 
 left join clasificacion c19 on c19.userId = u.id and c19.gpid=19 
 left join clasificacion c20 on c20.userId = u.id and c20.gpid=20 
 left join clasificacion c21 on c21.userId = u.id and c21.gpid=21 
 left join clasificacion c22 on c22.userId = u.id and c22.gpid=22 
 left join clasificacion c23 on c23.userId = u.id and c23.gpid=23 
 left join clasificacion c24 on c24.userId = u.id and c24.gpid=24 
 ;


 