DROP VIEW IF EXISTS v_tabla_clasificacion;
CREATE VIEW v_tabla_clasificacion 
AS 
 select u.id, u.nombre, p.temporada_id,
 c1.puesto as GP1, 
 c1.puntos as GP1ptos,
 c2.puesto as GP2, 
 c2.puntos as GP2ptos,
 c3.puesto as GP3, 
 c3.puntos as GP3ptos,
 c4.puesto as GP4, 
 c4.puntos as GP4ptos,
 c5.puesto as GP5, 
 c5.puntos as GP5ptos,
 c6.puesto as GP6, 
 c6.puntos as GP6ptos,
 c7.puesto as GP7, 
 c7.puntos as GP7ptos,
 c8.puesto as GP8, 
 c8.puntos as GP8ptos,
 c9.puesto as GP9, 
 c9.puntos as GP9ptos,
 c10.puesto as GP10, 
 c10.puntos as GP10ptos,
 c11.puesto as GP11,
 c11.puntos as GP11ptos,
 c12.puesto as GP12,
 c12.puntos as GP12ptos,
 c13.puesto as GP13,
 c13.puntos as GP13ptos,
 c14.puesto as GP14,
 c14.puntos as GP14ptos,
 c15.puesto as GP15,
 c15.puntos as GP15ptos,
 c16.puesto as GP16,
 c16.puntos as GP16ptos,
 c17.puesto as GP17,
 c17.puntos as GP17ptos,
 c18.puesto as GP18,
 c18.puntos as GP18ptos,
 c19.puesto as GP19,
 c19.puntos as GP19ptos,
 c20.puesto as GP20,
 c20.puntos as GP20ptos,
 c21.puesto as GP21,
 c21.puntos as GP21ptos,
 c22.puesto as GP22,
 c22.puntos as GP22ptos,
 c23.puesto as GP23,
 c23.puntos as GP23ptos,
 c24.puesto as GP24,
 c24.puntos as GP24ptos,
 (IFNULL(c1.puntos,0) 
  +  IFNULL(c2.puntos, 0) 
 +  IFNULL(c3.puntos, 0) 
 +  IFNULL(c4.puntos, 0) 
 +  IFNULL(c5.puntos, 0) 
 +  IFNULL(c6.puntos, 0) 
 +  IFNULL(c7.puntos, 0) 
 +  IFNULL(c8.puntos, 0) 
 +  IFNULL(c9.puntos, 0) 
 +  IFNULL(c10.puntos, 0) 
 +  IFNULL(c11.puntos, 0) 
 +  IFNULL(c12.puntos, 0) 
 +  IFNULL(c13.puntos, 0) 
 +  IFNULL(c14.puntos, 0) 
 +  IFNULL(c15.puntos, 0) 
 +  IFNULL(c16.puntos, 0) 
 +  IFNULL(c17.puntos, 0) 
 +  IFNULL(c18.puntos, 0) 
 +  IFNULL(c19.puntos, 0) 
 +  IFNULL(c20.puntos, 0) 
 +  IFNULL(c21.puntos, 0) 
 +  IFNULL(c22.puntos, 0) 
 +  IFNULL(c23.puntos, 0) 
 +  IFNULL(c24.puntos, 0)) as total,

 round((IFNULL(c1.ganancia,0) 
 +  IFNULL(c2.ganancia, 0) 
 +  IFNULL(c3.ganancia, 0) 
 +  IFNULL(c4.ganancia, 0) 
 +  IFNULL(c5.ganancia, 0) 
 +  IFNULL(c6.ganancia, 0) 
 +  IFNULL(c7.ganancia, 0) 
 +  IFNULL(c8.ganancia, 0) 
 +  IFNULL(c9.ganancia, 0) 
 +  IFNULL(c10.ganancia, 0) 
 +  IFNULL(c11.ganancia, 0) 
 +  IFNULL(c12.ganancia, 0) 
 +  IFNULL(c13.ganancia, 0) 
 +  IFNULL(c14.ganancia, 0) 
 +  IFNULL(c15.ganancia, 0) 
 +  IFNULL(c16.ganancia, 0) 
 +  IFNULL(c17.ganancia, 0) 
 +  IFNULL(c18.ganancia, 0) 
 +  IFNULL(c19.ganancia, 0) 
 +  IFNULL(c20.ganancia, 0) 
 +  IFNULL(c21.ganancia, 0) 
 +  IFNULL(c22.ganancia, 0) 
 +  IFNULL(c23.ganancia, 0) 
 +  IFNULL(c24.ganancia, 0)),2) as ganancia
 from participante p 
 inner join user u on u.id = p.user_id
 left join clasificacion c1 on c1.participante_id = p.id and c1.gpid=1 
 left join clasificacion c2 on c2.participante_id = p.id and c2.gpid=2 
 left join clasificacion c3 on c3.participante_id = p.id and c3.gpid=3 
 left join clasificacion c4 on c4.participante_id = p.id and c4.gpid=4 
 left join clasificacion c5 on c5.participante_id = p.id and c5.gpid=5 
 left join clasificacion c6 on c6.participante_id = p.id and c6.gpid=6 
 left join clasificacion c7 on c7.participante_id = p.id and c7.gpid=7 
 left join clasificacion c8 on c8.participante_id = p.id and c8.gpid=8 
 left join clasificacion c9 on c9.participante_id = p.id and c9.gpid=9 
 left join clasificacion c10 on c10.participante_id = p.id and c10.gpid=10 
 left join clasificacion c11 on c11.participante_id = p.id and c11.gpid=11 
 left join clasificacion c12 on c12.participante_id = p.id and c12.gpid=12 
 left join clasificacion c13 on c13.participante_id = p.id and c13.gpid=13 
 left join clasificacion c14 on c14.participante_id = p.id and c14.gpid=14 
 left join clasificacion c15 on c15.participante_id = p.id and c15.gpid=15 
 left join clasificacion c16 on c16.participante_id = p.id and c16.gpid=16 
 left join clasificacion c17 on c17.participante_id = p.id and c17.gpid=17 
 left join clasificacion c18 on c18.participante_id = p.id and c18.gpid=18 
 left join clasificacion c19 on c19.participante_id = p.id and c19.gpid=19 
 left join clasificacion c20 on c20.participante_id = p.id and c20.gpid=20 
 left join clasificacion c21 on c21.participante_id = p.id and c21.gpid=21 
 left join clasificacion c22 on c22.participante_id = p.id and c22.gpid=22 
 left join clasificacion c23 on c23.participante_id = p.id and c23.gpid=23 
 left join clasificacion c24 on c24.participante_id = p.id and c24.gpid=24 
 ;