from typing import Sequence, Any, Union, List, Type

import sqlalchemy
from sqlalchemy.orm.session import Session
from sqlalchemy.engine.result import ResultProxy

from models.models import Ztf, Found


class DatabaseProvider:
    """Service class for querying SQL-DB"""

    def __init__(self: Any, engine_uri: str) -> None:
        if not engine_uri:
            raise ValueError(
                '''
                    The values specified in engine
                    parameter has to be supported by SQLAlchemy
                '''
            )
        self.engine_uri = engine_uri
        db_engine = sqlalchemy.create_engine(engine_uri)
        db_session = sqlalchemy.orm.sessionmaker(bind=db_engine)
        self.session: Session = db_session()

    def get_ztf_data(self: Any, serialize: bool = False) -> Any:
        '>>> Query DB for all ZTF data'
        all_ztf_data: Sequence[Ztf] = self.session.query(
            Ztf).order_by(Ztf.obsid).limit(50)

        if serialize:
            return [ztf_row.serialize() for (ztf_row) in all_ztf_data]
        else:
            return all_ztf_data

    def query_moving_object_search(
            self: 'DatabaseProvider',
            objid: str,
            start_row: int = 0,
            end_row: int = 10
    ) -> Any:

        all_moving_object_search_data: List[(Any)] = self.session.query(
            Found.obsjd,
            Found.ra,
            Found.dec,
            Found.dra,
            Found.ddec,
            Found.ra3sig,
            Found.dec3sig,
            Found.vmag,
            Found.rh,
            Found.rdot,
            Found.delta,
            Found.phase,
            Found.selong,
            Found.sangle,
            Found.vangle,
            Found.trueanomaly,
            Found.tmtp,
            Ztf.pid,
            Ztf.obsdate,
            Ztf.infobits,
            Ztf.field,
            Ztf.ccdid,
            Ztf.qid,
            Ztf.rcid,
            Ztf.fid,
            Ztf.filtercode,
            Ztf.expid,
            Ztf.filefracday,
            Ztf.seeing,
            Ztf.airmass,
            Ztf.moonillf,
            Ztf.maglimit
        ) \
            .join(Ztf, Found.obsid == Ztf.obsid) \
            .filter(Found.objid == objid) \
            .offset(start_row) \
            .limit(end_row - start_row)

        serialized_row: Any = {}
        all_serialized_rows: Any = []
        for row in all_moving_object_search_data:
            serialized_row = {
                "obsjd": row.obsjd,
                "ra": row.ra,
                "dec": row.dec,
                "dra": row.dra,
                "ddec": row.ddec,
                "ra3sig": row.ra3sig,
                "dec3sig": row.dec3sig,
                "vmag": row.vmag,
                "rh": row.rh,
                "rdot": row.rdot,
                "delta": row.delta,
                "phase": row.phase,
                "selong": row.selong,
                "sangle": row.sangle,
                "vangle": row.vangle,
                "trueanomaly": row.trueanomaly,
                "tmtp": row.tmtp,
                "pid": row.pid,
                "obsdate": row.obsdate,
                "infobits": row.infobits,
                "field": row.field,
                "ccdid": row.ccdid,
                "qid": row.qid,
                "rcid": row.rcid,
                "fid": row.fid,
                "filtercode": row.filtercode,
                "expid": row.expid,
                "filefracday": row.filefracday,
                "seeing": row.seeing,
                "airmass": row.airmass,
                "moonillf": row.moonillf,
                "maglimit": row.maglimit
            }
            for a in serialized_row:
                # print(a)
                # print(str(serialized_row[a]))
                serialized_row[a] = str(serialized_row[a])
            all_serialized_rows.append(serialized_row)

        return all_serialized_rows