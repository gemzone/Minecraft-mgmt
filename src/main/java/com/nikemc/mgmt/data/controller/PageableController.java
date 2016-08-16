package com.nikemc.mgmt.data.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.nikemc.mgmt.data.domain.CoArtMap;
import com.nikemc.mgmt.data.domain.CoBlock;
import com.nikemc.mgmt.data.domain.CoChat;
import com.nikemc.mgmt.data.domain.CoCommand;
import com.nikemc.mgmt.data.domain.CoContainer;
import com.nikemc.mgmt.data.domain.CoEntity;
import com.nikemc.mgmt.data.domain.CoEntityMap;
import com.nikemc.mgmt.data.domain.CoMaterialMap;
import com.nikemc.mgmt.data.domain.CoSession;
import com.nikemc.mgmt.data.domain.CoSign;
import com.nikemc.mgmt.data.service.CoArtMapJpaRepository;
import com.nikemc.mgmt.data.service.CoArtMapService;
import com.nikemc.mgmt.data.service.CoBlockJpaRepository;
import com.nikemc.mgmt.data.service.CoBlockService;
import com.nikemc.mgmt.data.service.CoChatJpaRepository;
import com.nikemc.mgmt.data.service.CoChatService;
import com.nikemc.mgmt.data.service.CoCommandJpaRepository;
import com.nikemc.mgmt.data.service.CoCommandService;
import com.nikemc.mgmt.data.service.CoContainerJpaRepository;
import com.nikemc.mgmt.data.service.CoContainerService;
import com.nikemc.mgmt.data.service.CoEntityJpaRepository;
import com.nikemc.mgmt.data.service.CoEntityMapJpaRepository;
import com.nikemc.mgmt.data.service.CoEntityMapService;
import com.nikemc.mgmt.data.service.CoEntityService;
import com.nikemc.mgmt.data.service.CoMaterialMapJpaRepository;
import com.nikemc.mgmt.data.service.CoMaterialMapService;
import com.nikemc.mgmt.data.service.CoSessionJpaRepository;
import com.nikemc.mgmt.data.service.CoSessionService;
import com.nikemc.mgmt.data.service.CoSignJpaRepository;
import com.nikemc.mgmt.data.service.CoSignService;

/**
 * @author gemzone
 *
 */
@Controller
public class PageableController 
{
	private static final Log log = LogFactory.getLog(CoArtMapService.class);
	
	@Autowired 
	CoArtMapService coArtMapService;
	
	@Autowired 
	CoArtMapJpaRepository coArtMapJpaRepository;
	
	@ResponseBody
	@RequestMapping(path = "/artMap/list/{page}/{size}", produces = "application/json")
	public Page<CoArtMap> artMap(Model model, 
			@PathVariable("page") int page,
			@PathVariable("size") int size,
			HttpSession session)
	{
		// Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
		PageRequest pageRequest = new PageRequest(page, size, Sort.Direction.DESC, "rowid");
		return coArtMapJpaRepository.findAll(pageRequest);
	}
	

	@Autowired 
	CoBlockJpaRepository coBlockJpaRepository;
	
	@Autowired 
	CoBlockService coBlockService;
	
//	@ResponseBody
//	@RequestMapping(path = "/block/list/{page}/{size}", produces = "application/json")
//	public Page<CoBlock> block(Model model, 
//			@PathVariable("page") int page,
//			@PathVariable("size") int size,
//			HttpSession session)
//	{
//		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
//		
//		log.info("pageable.getPageNumber : " + pageable.getPageNumber() );
//		log.info("pageable.getOffset : " + pageable.getOffset() );
//		log.info("pageable.getPageSize : " + pageable.getPageSize() );
//		
//		// PageRequest request = new PageRequest(page - 1, size, Sort.Direction.DESC, "rowid");
//		return coBlockJpaRepository.findAll(pageable);
//	}
	

	@ResponseBody
	@RequestMapping(path = "/block/more/{start}/{count}", produces = "application/json")
	public List<CoBlock> block(Model model,
			@PathVariable("start") int start,
			@PathVariable("count") int count,
			HttpSession session)
	{
		
//		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
//		
//		log.info("pageable.getPageNumber : " + pageable.getPageNumber() );
//		log.info("pageable.getOffset : " + pageable.getOffset() );
//		log.info("pageable.getPageSize : " + pageable.getPageSize() );
//		
		// PageRequest request = new PageRequest(page - 1, size, Sort.Direction.DESC, "rowid");
		return coBlockJpaRepository.listMore(start, count);
		
	}
	
	
	
	
	
	@Autowired 
	CoChatJpaRepository coChatJpaRepository;
	
	@Autowired 
	CoChatService coChatService;
	
	@ResponseBody
	@RequestMapping(path = "/chat/list/{page}/{size}", produces = "application/json")
	public Page<CoChat> chat(Model model, 
			@PathVariable("page") int page,
			@PathVariable("size") int size,
			HttpSession session)
	{
		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
		return coChatJpaRepository.findAll(pageable);
	}
	
	
	
	
	@Autowired 
	CoCommandJpaRepository coCommandJpaRepository;
	
	@Autowired 
	CoCommandService coCommandService;

	@ResponseBody
	@RequestMapping(path = "/command/list/{page}/{size}", produces = "application/json")
	public Page<CoCommand> command(Model model, 
			@PathVariable("page") int page,
			@PathVariable("size") int size,
			HttpSession session)
	{
		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
		return coCommandJpaRepository.findAll(pageable);
	}
	
	
	
	@Autowired 
	CoContainerJpaRepository coContainerJpaRepository;
	
	@Autowired 
	CoContainerService coContainerService;

	@ResponseBody
	@RequestMapping(path = "/container/list/{page}/{size}", produces = "application/json")
	public Page<CoContainer> container(Model model, 
			@PathVariable("page") int page,
			@PathVariable("size") int size,
			HttpSession session)
	{
		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
		return coContainerJpaRepository.findAll(pageable);
	}
	
	
	
	@Autowired 
	CoEntityJpaRepository coEntityJpaRepository;
	
	@Autowired 
	CoEntityService coEntityService;

	@ResponseBody
	@RequestMapping(path = "/entity/list/{page}/{size}", produces = "application/json")
	public Page<CoEntity> entity(Model model, 
			@PathVariable("page") int page,
			@PathVariable("size") int size,
			HttpSession session)
	{
		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
		return coEntityJpaRepository.findAll(pageable);
	}
	
	
	
	
	@Autowired 
	CoEntityMapJpaRepository coEntityMapJpaRepository;
	
	@Autowired 
	CoEntityMapService coEntityMapService;
	

	@ResponseBody
	@RequestMapping(path = "/entityMap/list/{page}/{size}", produces = "application/json")
	public Page<CoEntityMap> entityMap(Model model, 
			@PathVariable("page") int page,
			@PathVariable("size") int size,
			HttpSession session)
	{
		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
		return coEntityMapJpaRepository.findAll(pageable);
	}
	
	
	
	
	@Autowired 
	CoMaterialMapJpaRepository coMaterialMapJpaRepository;
	
	@Autowired 
	CoMaterialMapService coMaterialMapService;
	

	@ResponseBody
	@RequestMapping(path = "/materialMap/list/{page}/{size}", produces = "application/json")
	public Page<CoMaterialMap> materialMap(Model model, 
			@PathVariable("page") int page,
			@PathVariable("size") int size,
			HttpSession session)
	{
		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
		return coMaterialMapJpaRepository.findAll(pageable);
	}

	
	
	@Autowired 
	CoSessionJpaRepository coSessionJpaRepository;
	
	@Autowired 
	CoSessionService coSessionService;

	@ResponseBody
	@RequestMapping(path = "/session/list/{page}/{size}", produces = "application/json")
	public Page<CoSession> session(Model model, 
			@PathVariable("page") int page,
			@PathVariable("size") int size,
			HttpSession session)
	{
		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
		return coSessionJpaRepository.findAll(pageable);
	}
	
	
	
	@Autowired 
	CoSignJpaRepository coSignJpaRepository;
	
	@Autowired 
	CoSignService coSignService;
	

	@ResponseBody
	@RequestMapping(path = "/sign/list/{page}/{size}", produces = "application/json")
	public Page<CoSign> sign(Model model, 
			@PathVariable("page") int page,
			@PathVariable("size") int size,
			HttpSession session)
	{
		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
		return coSignJpaRepository.findAll(pageable);
	}
	
	
}

