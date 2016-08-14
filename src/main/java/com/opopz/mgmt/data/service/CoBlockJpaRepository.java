package com.opopz.mgmt.data.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.opopz.mgmt.data.domain.CoBlock;

/**
 * @author gemzone (admin@modjk.com)
 * @version 1.0
 */
public interface CoBlockJpaRepository extends JpaRepository<CoBlock, Integer>
{
//    @Query(value = "SELECT * "
//		+ "FROM co.co_block "
//		+ "LEFT JOIN co.co_user ON co.co_block.user = co.co_user.rowid "
//		+ "ORDER BY  "
//		+ "LIMIT 0, 100", nativeQuery = true )
//    public List<CoBlock> list();
    
//	
//    @Query(value = "SELECT * "
//    		+ "FROM co.co_block "
//    		+ "ORDER BY rowid DESC "
//    		+ "LIMIT 0, 100", nativeQuery = true )
//        public List<CoBlock> list();
    
    @Query(value = "SELECT * "
    		+ "FROM co.co_block "
    		+ "ORDER BY rowid DESC "
    		+ "LIMIT :start, :count", nativeQuery = true )
        public List<CoBlock> listMore(@Param("start") int start,  @Param("count") int count);
}

