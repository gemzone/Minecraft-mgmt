package com.opopz.mgmt.data.service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.opopz.mgmt.data.domain.CoUser;

/**
 * @author gemzone (admin@modjk.com)
 * @version 1.0
 */
public interface CoUserJpaRepository extends JpaRepository<CoUser, Integer>
{
	@Query(value="SELECT COUNT(rowid) FROM co.co_user WHERE uuid IS NOT NULL", nativeQuery = true)
	public Integer uniqueUserCount();
	
}